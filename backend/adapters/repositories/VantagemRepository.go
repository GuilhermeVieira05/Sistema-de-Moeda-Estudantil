package repositories

import (
	"backend/application/model"

	"gorm.io/gorm"
)

type VantagemRepository struct {
	db *gorm.DB
}

func NewVantagemRepository(db *gorm.DB) *VantagemRepository {
	return &VantagemRepository{db: db}
}

func (r *VantagemRepository) Create(vantagem *model.Vantagem) error {
	return r.db.Create(vantagem).Error
}

func (r *VantagemRepository) FindByID(id uint) (*model.Vantagem, error) {
	var vantagem model.Vantagem
	err := r.db.Preload("EmpresaParceira").First(&vantagem, id).Error
	if err != nil {
		return nil, err
	}
	return &vantagem, nil
}

func (r *VantagemRepository) Update(vantagem *model.Vantagem) error {
	return r.db.Save(vantagem).Error
}

func (r *VantagemRepository) Delete(id uint) error {
	return r.db.Delete(&model.Vantagem{}, id).Error
}

func (r *VantagemRepository) ListActive() ([]model.Vantagem, error) {
	var vantagens []model.Vantagem
	err := r.db.Preload("EmpresaParceira").Where("ativa = ?", true).Find(&vantagens).Error
	return vantagens, err
}

func (r *VantagemRepository) ListByEmpresa(empresaID uint) ([]model.Vantagem, error) {
	var vantagens []model.Vantagem
	err := r.db.Where("empresa_parceira_id = ?", empresaID).Find(&vantagens).Error
	return vantagens, err
}
