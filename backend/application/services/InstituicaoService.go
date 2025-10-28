package services

import (
	"backend/application/model"     
	"backend/adapters/repositories" 
	"backend/application/utils"  
	"backend/application/dto"   
	"errors"

	"gorm.io/gorm"
)

type InstituicaoService struct {
	db              *gorm.DB 
	instituicaoRepo *repositories.InstituicaoEnsinoRepository
	professorRepo   *repositories.ProfessorRepository
	userRepo        *repositories.UserRepository
	parceriaRepo    *repositories.ParceriaRepository
}

func NewInstituicaoService(
	db *gorm.DB,
	ir *repositories.InstituicaoEnsinoRepository,
	pr *repositories.ProfessorRepository,
	ur *repositories.UserRepository,
	parRepo *repositories.ParceriaRepository,
) *InstituicaoService {
	return &InstituicaoService{
		db:              db,
		instituicaoRepo: ir,
		professorRepo:   pr,
		userRepo:        ur,
		parceriaRepo:    parRepo,
	}
}

func (s *InstituicaoService) ListInstituicoes() ([]model.InstituicaoEnsino, error) {
	return s.instituicaoRepo.FindAll()
}

// GetInstituicaoByID retorna o perfil de uma instituição pelo ID.
func (s *InstituicaoService) GetInstituicaoByID(id uint) (*model.InstituicaoEnsino, error) {
	instituicao, err := s.instituicaoRepo.FindByID(id)
	if err != nil {
		return nil, errors.New("instituição não encontrada")
	}
	return instituicao, nil
}

// UpdateInstituicao atualiza os dados de uma instituição.
func (s *InstituicaoService) UpdateInstituicao(id uint, input *model.InstituicaoEnsino) (*model.InstituicaoEnsino, error) {
	instituicao, err := s.GetInstituicaoByID(id) // Busca o perfil existente
	if err != nil {
		return nil, err
	}

	instituicao.Nome = input.Nome
	if err := s.instituicaoRepo.Update(instituicao); err != nil {
		return nil, errors.New("erro ao atualizar instituição")
	}
	return instituicao, nil
}


// === FUNÇÃO CORRIGIDA ===
// A assinatura agora usa *model.RegisterProfessorInput
func (s *InstituicaoService) RegisterProfessor(instID uint, input *dto.RegisterProfessorInput) (*model.Professor, error) {
	// 1. Validar duplicidade
	if _, err := s.userRepo.FindByEmail(input.Email); err == nil {
		return nil, errors.New("email já está em uso")
	}
	if _, err := s.professorRepo.FindByCPF(input.CPF); err == nil {
		return nil, errors.New("CPF já está em uso")
	}

	// 2. Hash da senha
	hashedPassword, err := utils.HashPassword(input.Password)
	if err != nil {
		return nil, errors.New("erro interno ao processar senha")
	}

	// 3. Iniciar transação
	tx := s.db.Begin()
	if tx.Error != nil {
		return nil, errors.New("erro ao iniciar transação")
	}

	// 4. Criar User
	newUser := &model.User{
		Email:    input.Email,
		Password: hashedPassword,
		Role:     "professor",
	}
	if err := s.userRepo.CreateWithTx(tx, newUser); err != nil {
		tx.Rollback()
		return nil, errors.New("erro ao criar usuário para o professor")
	}

	// 5. Criar Professor
	newProfessor := &model.Professor{
		UserID:              newUser.ID,
		Nome:                input.Nome,
		CPF:                 input.CPF,
		Departamento:        input.Departamento,
		InstituicaoEnsinoID: instID,
		SaldoMoedas:         0, // Saldo inicial
	}
	if err := s.professorRepo.CreateWithTx(tx, newProfessor); err != nil {
		tx.Rollback()
		return nil, errors.New("erro ao criar perfil do professor")
	}

	// 6. Commit
	if err := tx.Commit().Error; err != nil {
		return nil, errors.New("erro ao finalizar cadastro")
	}

	newProfessor.User = *newUser // Anexa os dados do usuário para a resposta
	return newProfessor, nil
}

// ListProfessoresByInstituicao retorna todos os professores de uma instituição.
func (s *InstituicaoService) ListProfessoresByInstituicao(instID uint) ([]model.Professor, error) {
	return s.professorRepo.FindByInstituicaoID(instID)
}

// GetProfessorByID busca um professor pelo ID, verificando se ele pertence à instituição.
func (s *InstituicaoService) GetProfessorByID(instID, profID uint) (*model.Professor, error) {
	professor, err := s.professorRepo.FindByID(profID)
	if err != nil {
		return nil, errors.New("professor não encontrado")
	}

	// Verificação de segurança
	if professor.InstituicaoEnsinoID != instID {
		return nil, errors.New("acesso negado: professor não pertence a esta instituição")
	}

	return professor, nil
}

// === FUNÇÃO CORRIGIDA ===
// A assinatura agora usa *model.UpdateProfessorInput
func (s *InstituicaoService) UpdateProfessor(instID, profID uint, input *dto.UpdateProfessorInput) (*model.Professor, error) {
	// GetProfessorByID já faz a verificação de segurança
	professor, err := s.GetProfessorByID(instID, profID)
	if err != nil {
		return nil, err
	}

	// Atualiza os campos permitidos
	professor.Nome = input.Nome
	professor.Departamento = input.Departamento

	if err := s.professorRepo.Update(professor); err != nil {
		return nil, errors.New("erro ao atualizar professor")
	}
	return professor, nil
}

// DeleteProfessor remove um professor e seu usuário associado.
func (s *InstituicaoService) DeleteProfessor(instID, profID uint) error {
	// GetProfessorByID já faz a verificação de segurança
	professor, err := s.GetProfessorByID(instID, profID)
	if err != nil {
		return err
	}

	tx := s.db.Begin()
	if tx.Error != nil {
		return errors.New("erro ao iniciar transação")
	}

	if err := s.professorRepo.DeleteWithTx(tx, professor.ID); err != nil {
		tx.Rollback()
		return errors.New("erro ao deletar perfil do professor")
	}

	if err := s.userRepo.Delete(professor.UserID); err != nil {
		tx.Rollback()
		return errors.New("erro ao deletar usuário do professor")
	}

	return tx.Commit().Error
}

// --- Gestão de Parcerias ---

// ListParcerias lista as parcerias de uma instituição.
func (s *InstituicaoService) ListParcerias(instID uint) ([]model.Parceria, error) {
	return s.parceriaRepo.FindByInstituicaoID(instID)
}

// CreateParceria cria um novo registro de parceria.
func (s *InstituicaoService) CreateParceria(instID, empresaID uint) (*model.Parceria, error) {
	if _, err := s.parceriaRepo.Find(instID, empresaID); err == nil {
		return nil, errors.New("parceria já existe")
	}

	parceria := &model.Parceria{
		Id_instituicao: instID,
		Id_empresa:     empresaID,
	}

	if err := s.parceriaRepo.Create(parceria); err != nil {
		return nil, errors.New("erro ao criar parceria")
	}
	return parceria, nil
}

// DeleteParceria remove um registro de parceria.
func (s *InstituicaoService) DeleteParceria(instID, empresaID uint) error {
	parceria, err := s.parceriaRepo.Find(instID, empresaID)
	if err != nil {
		return errors.New("parceria não encontrada")
	}

	return s.parceriaRepo.Delete(parceria)
}