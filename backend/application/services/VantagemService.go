package services

import (
	"backend/adapters/repositories"
	"backend/application/model"
	"errors"
)

type VantagemService struct {
	vantagemRepo *repositories.VantagemRepository
	empresaRepo  *repositories.EmpresaParceiraRepository
}

func NewVantagemService(vantagemRepo *repositories.VantagemRepository, empresaRepo *repositories.EmpresaParceiraRepository) *VantagemService {
	return &VantagemService{
		vantagemRepo: vantagemRepo,
		empresaRepo:  empresaRepo,
	}
}

func (s *VantagemService) CreateVantagem(vantagem *model.Vantagem) error {
	// Verificar se empresa existe
	_, err := s.empresaRepo.FindByID(vantagem.EmpresaParceiraID)
	if err != nil {
		return errors.New("empresa parceira não encontrada")
	}

	return s.vantagemRepo.Create(vantagem)
}

func (s *VantagemService) FindByEmpresaAndID(empresaID uint, id uint) (*model.Vantagem, error) {
	return s.vantagemRepo.FindByEmpresaAndID(empresaID, id)
}

func (s *VantagemService) UpdateVantagem(id uint, vantagem *model.Vantagem) error {
	existing, err := s.vantagemRepo.FindByID(id)
	if err != nil {
		return errors.New("vantagem não encontrada")
	}

	existing.Titulo = vantagem.Titulo
	existing.Descricao = vantagem.Descricao
	existing.FotoURL = vantagem.FotoURL
	existing.CustoMoedas = vantagem.CustoMoedas
	existing.Ativa = vantagem.Ativa

	return s.vantagemRepo.Update(existing)
}

func (s *VantagemService) DeleteVantagem(id uint) error {
	return s.vantagemRepo.Delete(id)
}

func (s *VantagemService) GetVantagemByID(id uint) (*model.Vantagem, error) {
	return s.vantagemRepo.FindByID(id)
}

func (s *VantagemService) ListVantagensAtivas() ([]model.Vantagem, error) {
	return s.vantagemRepo.ListActive()
}

func (s *VantagemService) ListVantagensByEmpresa(empresaID uint) ([]model.Vantagem, error) {
	return s.vantagemRepo.ListByEmpresa(empresaID)
}
