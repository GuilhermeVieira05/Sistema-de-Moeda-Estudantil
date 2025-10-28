package model

import (
	"gorm.io/gorm"
)

type InstituicaoEnsino struct {
	gorm.Model
    Nome string `gorm:"type:varchar(255);not null;uniqueIndex" json:"nome"`
	Email string `gorm:"type:varchar(255);not null;uniqueIndex" json:"email"`
	Password string `gorm:"type:varchar(255);not null" json:"-"`
	Cnpj string `gorm:"type:varchar(20);not null;uniqueIndex" json:"cnpj"`
}