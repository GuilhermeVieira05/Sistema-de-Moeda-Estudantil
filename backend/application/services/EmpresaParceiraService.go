package services

import (
	"backend/adapters/repositories"
	"backend/application/model"
	"errors"
)

type EmpresaParceiraService struct {
	empresaRepo *repositories.EmpresaParceiraRepository
	userRepo    *repositories.UserRepository
}

func NewEmpresaParceiraService(empresaRepo *repositories.EmpresaParceiraRepository, userRepo *repositories.UserRepository) *EmpresaParceiraService {
	return &EmpresaParceiraService{
		empresaRepo: empresaRepo,
		userRepo:    userRepo,
	}
}

func (s *EmpresaParceiraService) CreateEmpresa(empresa *model.EmpresaParceira) error {
	// Verificar se CNPJ já existe
	existingEmpresa, err := s.empresaRepo.FindByCNPJ(empresa.CNPJ)
	if err == nil && existingEmpresa != nil {
		return errors.New("CNPJ já cadastrado")
	}

	return s.empresaRepo.Create(empresa)
}

func (s *EmpresaParceiraService) GetEmpresaByUserID(userID uint) (*model.EmpresaParceira, error) {
	return s.empresaRepo.FindByUserID(userID)
}

func (s *EmpresaParceiraService) GetEmpresaByID(id uint) (*model.EmpresaParceira, error) {
	return s.empresaRepo.FindByID(id)
}
