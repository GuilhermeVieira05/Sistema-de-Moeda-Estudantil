package services

import (
	"backend/application/model"
	"backend/adapters/repositories" 
	"errors"
)

type ProfessorService struct {
	// db *gorm.DB // Para transações
	professorRepo *repositories.ProfessorRepository
	alunoRepo     *repositories.AlunoRepository         // Para enviar moedas
	transacaoRepo *repositories.TransacaoMoedaRepository // Para enviar moedas e extrato
}

func NewProfessorService(
	// db *gorm.DB,
	pRepo *repositories.ProfessorRepository,
	aRepo *repositories.AlunoRepository,
	tRepo *repositories.TransacaoMoedaRepository,
) *ProfessorService {
	return &ProfessorService{
		// db: db,
		professorRepo: pRepo,
		alunoRepo:     aRepo,
		transacaoRepo: tRepo,
	}
}

// GetPerfil busca o perfil do professor logado (pelo UserID)
func (s *ProfessorService) GetPerfil(userID uint) (*model.Professor, error) {
	professor, err := s.professorRepo.FindByUserID(userID)
	if err != nil {
		return nil, errors.New("perfil de professor não encontrado")
	}
	return professor, nil
}

// GetExtrato busca o extrato de transações do professor logado
func (s *ProfessorService) GetExtrato(professorID uint) ([]model.TransacaoMoeda, error) {
	// Busca transações onde o professor é o remetente (enviou)
	return s.transacaoRepo.FindByProfessorID(professorID)
}

// EnviarMoedas (DTO de Input é necessário)
// Esta é uma lógica de exemplo, você precisará dos repositórios
func (s *ProfessorService) EnviarMoedas(professorID uint, input *model.EnviarMoedasInput) (*model.TransacaoMoeda, error) {

	// 1. Busca o professor (remetente)
	professor, err := s.professorRepo.FindByID(professorID)
	if err != nil {
		return nil, errors.New("professor não encontrado")
	}

	// 2. Verifica se o professor tem saldo
	if professor.SaldoMoedas < input.Valor {
		return nil, errors.New("saldo insuficiente")
	}

	// 3. Busca o aluno (destinatário)
	aluno, err := s.alunoRepo.FindByID(input.AlunoID)
	if err != nil {
		return nil, errors.New("aluno não encontrado")
	}

	// --- Início da Transação (Idealmente) ---
	// tx := s.db.Begin()
	// ... (Toda a lógica abaixo deveria usar 'tx')

	// 4. Debita do professor
	professor.SaldoMoedas -= input.Valor
	if err := s.professorRepo.Update(professor); err != nil {
		// tx.Rollback()
		return nil, errors.New("erro ao debitar do professor")
	}

	// 5. Credita ao aluno
	aluno.SaldoMoedas += input.Valor
	if err := s.alunoRepo.Update(aluno); err != nil {
		// tx.Rollback()
		return nil, errors.New("erro ao creditar ao aluno")
	}

	// 6. Cria o registro da transação
	transacao := &model.TransacaoMoeda{
		ProfessorID: &professor.ID,
		AlunoID:     &aluno.ID,
		Valor:       input.Valor,
		Tipo:        "transferencia", // ou "merito"
		Descricao:   input.Descricao,
	}

	if err := s.transacaoRepo.Create(transacao); err != nil {
		// tx.Rollback()
		return nil, errors.New("erro ao registrar transação")
	}

	// tx.Commit()
	// --- Fim da Transação ---

	return transacao, nil
}