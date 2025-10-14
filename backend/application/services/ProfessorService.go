package services

import (
	"backend/adapters/repositories"
	"backend/application/model"
	"errors"
)

type ProfessorService struct {
	professorRepo *repositories.ProfessorRepository
	userRepo      *repositories.UserRepository
}

func NewProfessorService(professorRepo *repositories.ProfessorRepository, userRepo *repositories.UserRepository) *ProfessorService {
	return &ProfessorService{
		professorRepo: professorRepo,
		userRepo:      userRepo,
	}
}

func (s *ProfessorService) CreateProfessor(professor *model.Professor) error {
	return s.professorRepo.Create(professor)
}

func (s *ProfessorService) GetProfessorByUserID(userID uint) (*model.Professor, error) {
	return s.professorRepo.FindByUserID(userID)
}

func (s *ProfessorService) GetProfessorByID(id uint) (*model.Professor, error) {
	return s.professorRepo.FindByID(id)
}

func (s *ProfessorService) UpdateSaldo(professorID uint, valor int) error {
	professor, err := s.professorRepo.FindByID(professorID)
	if err != nil {
		return err
	}

	professor.SaldoMoedas += valor
	if professor.SaldoMoedas < 0 {
		return errors.New("saldo insuficiente")
	}

	return s.professorRepo.Update(professor)
}

// AdicionarMoedasSemestre adiciona 1000 moedas ao saldo do professor (chamado semestralmente)
func (s *ProfessorService) AdicionarMoedasSemestre(professorID uint) error {
	professor, err := s.professorRepo.FindByID(professorID)
	if err != nil {
		return err
	}

	professor.SaldoMoedas += 1000
	return s.professorRepo.Update(professor)
}
