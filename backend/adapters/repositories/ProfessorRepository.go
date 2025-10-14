package repositories

import (
	"backend/application/model"

	"gorm.io/gorm"
)

type ProfessorRepository struct {
	db *gorm.DB
}

func NewProfessorRepository(db *gorm.DB) *ProfessorRepository {
	return &ProfessorRepository{db: db}
}

func (r *ProfessorRepository) Create(professor *model.Professor) error {
	return r.db.Create(professor).Error
}

func (r *ProfessorRepository) FindByUserID(userID uint) (*model.Professor, error) {
	var professor model.Professor
	err := r.db.Preload("User").Preload("InstituicaoEnsino").Where("user_id = ?", userID).First(&professor).Error
	if err != nil {
		return nil, err
	}
	return &professor, nil
}

func (r *ProfessorRepository) FindByID(id uint) (*model.Professor, error) {
	var professor model.Professor
	err := r.db.Preload("User").Preload("InstituicaoEnsino").First(&professor, id).Error
	if err != nil {
		return nil, err
	}
	return &professor, nil
}

func (r *ProfessorRepository) Update(professor *model.Professor) error {
	return r.db.Save(professor).Error
}

func (r *ProfessorRepository) List() ([]model.Professor, error) {
	var professores []model.Professor
	err := r.db.Preload("User").Preload("InstituicaoEnsino").Find(&professores).Error
	return professores, err
}
