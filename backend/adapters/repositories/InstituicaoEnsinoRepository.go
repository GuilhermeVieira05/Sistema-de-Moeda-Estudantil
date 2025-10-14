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

func (r *InstituicaoEnsinoRepository) List() ([]model.InstituicaoEnsino, error) {
	var instituicoes []model.InstituicaoEnsino
	err := r.db.Find(&instituicoes).Error
	return instituicoes, err
}
