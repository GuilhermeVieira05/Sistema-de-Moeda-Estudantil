package model

import (
	"gorm.io/gorm"
)

type InstituicaoEnsino struct {
	gorm.Model
    Nome string `gorm:"type:varchar(255);not null;uniqueIndex" json:"nome"`
}