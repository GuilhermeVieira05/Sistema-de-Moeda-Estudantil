// backend/application/repositories/instituicao_ensino_repository.go
package repositories

import (
	"backend/application/model"

	"gorm.io/gorm"
)

type InstituicaoEnsinoRepository struct {
	db *gorm.DB
}

func NewInstituicaoEnsinoRepository(db *gorm.DB) *InstituicaoEnsinoRepository {
	return &InstituicaoEnsinoRepository{db: db}
}

func (r *InstituicaoEnsinoRepository) Create(instituicao *model.InstituicaoEnsino) error {
	return r.db.Create(instituicao).Error
}

func (r *InstituicaoEnsinoRepository) FindByID(id uint) (*model.InstituicaoEnsino, error) {
	var instituicao model.InstituicaoEnsino
	err := r.db.First(&instituicao, id).Error
	if err != nil {
		return nil, err
	}
	return &instituicao, nil
}

// FindAll (Renomeado de List para bater com o InstituicaoService)
func (r *InstituicaoEnsinoRepository) FindAll() ([]model.InstituicaoEnsino, error) {
	var instituicoes []model.InstituicaoEnsino
	err := r.db.Find(&instituicoes).Error
	return instituicoes, err
}

// Update (Método adicionado que estava faltando para o Service)
func (r *InstituicaoEnsinoRepository) Update(instituicao *model.InstituicaoEnsino) error {
	return r.db.Save(instituicao).Error
}