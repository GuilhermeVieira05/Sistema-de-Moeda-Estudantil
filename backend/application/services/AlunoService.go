package services

import (
	"backend/adapters/repositories"
	"backend/application/model"
	"errors"

	"gorm.io/gorm"
)

type AlunoService struct {
	alunoRepo    *repositories.AlunoRepository
	userRepo     *repositories.UserRepository
	emailService *EmailService
}

func NewAlunoService(alunoRepo *repositories.AlunoRepository, userRepo *repositories.UserRepository, emailService *EmailService) *AlunoService {
	return &AlunoService{
		alunoRepo:    alunoRepo,
		userRepo:     userRepo,
		emailService: emailService,
	}
}

func (s *AlunoService) CreateAluno(aluno *model.Aluno) error {
	// Verificar se CPF já existe
	existingAluno, err := s.alunoRepo.FindByCPF(aluno.CPF)
	if err == nil && existingAluno != nil {
		return errors.New("CPF já cadastrado")
	}

	return s.alunoRepo.Create(aluno)
}

func (s *AlunoService) GetAlunoByUserID(userID uint) (*model.Aluno, error) {
	return s.alunoRepo.FindByUserID(userID)
}

func (s *AlunoService) GetAlunoByID(id uint) (*model.Aluno, error) {
	return s.alunoRepo.FindByID(id)
}

func (s *AlunoService) UpdateAluno(alunoAtualizado *model.Aluno) error {
	alunoExistente, err := s.alunoRepo.FindByID(alunoAtualizado.ID)
	if err != nil {
		return err
	}

	// Atualiza apenas os campos permitidos
	alunoExistente.Nome = alunoAtualizado.Nome
	alunoExistente.RG = alunoAtualizado.RG
	alunoExistente.Endereco = alunoAtualizado.Endereco
	alunoExistente.Curso = alunoAtualizado.Curso
	alunoExistente.InstituicaoEnsinoID = alunoAtualizado.InstituicaoEnsinoID

	return s.alunoRepo.Update(alunoExistente)
}

func (s *AlunoService) UpdateSaldo(alunoID uint, valor int) error {
	aluno, err := s.alunoRepo.FindByID(alunoID)
	if err != nil {
		return err
	}

	aluno.SaldoMoedas += valor
	if aluno.SaldoMoedas < 0 {
		return errors.New("saldo insuficiente")
	}

	return s.alunoRepo.Update(aluno)
}

func (s *AlunoService) ListAlunos() ([]model.Aluno, error) {
	return s.alunoRepo.List()
}

func (s *AlunoService) GetExtrato(userID uint) (map[string]interface{}, error) {
	aluno, err := s.alunoRepo.FindByUserID(userID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("aluno não encontrado")
		}
		return nil, err
	}

	// Buscar transações e resgates será feito nos respectivos serviços
	return map[string]interface{}{
		"aluno":        aluno,
		"saldo_moedas": aluno.SaldoMoedas,
	}, nil
}
