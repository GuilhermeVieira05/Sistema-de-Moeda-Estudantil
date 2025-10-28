// backend/application/repositories/professor_repository.go
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

// CreateWithTx cria um professor dentro de uma transação (usado pelo InstituicaoService)
func (r *ProfessorRepository) CreateWithTx(tx *gorm.DB, professor *model.Professor) error {
	return tx.Create(professor).Error
}

// FindByID (com User)
func (r *ProfessorRepository) FindByID(id uint) (*model.Professor, error) {
	var professor model.Professor
	// Preload("User") traz os dados do usuário associado
	err := r.db.Preload("User").First(&professor, id).Error
	return &professor, err
}

// FindByUserID (com User)
func (r *ProfessorRepository) FindByUserID(userID uint) (*model.Professor, error) {
	var professor model.Professor
	err := r.db.Preload("User").Where("user_id = ?", userID).First(&professor).Error
	return &professor, err
}

// FindByCPF
func (r *ProfessorRepository) FindByCPF(cpf string) (*model.Professor, error) {
	var professor model.Professor
	err := r.db.Where("cpf = ?", cpf).First(&professor).Error
	return &professor, err
}

// FindByInstituicaoID lista todos os professores de uma instituição
func (r *ProfessorRepository) FindByInstituicaoID(instID uint) ([]model.Professor, error) {
	var professores []model.Professor
	err := r.db.Preload("User").Where("instituicao_ensino_id = ?", instID).Find(&professores).Error
	return professores, err
}

// Update
func (r *ProfessorRepository) Update(professor *model.Professor) error {
	return r.db.Save(professor).Error
}

// DeleteWithTx deleta um professor dentro de uma transação
func (r *ProfessorRepository) DeleteWithTx(tx *gorm.DB, id uint) error {
	return tx.Delete(&model.Professor{}, id).Error
}