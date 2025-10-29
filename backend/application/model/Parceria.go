package model

import "time"

type Parceria struct {
	Id_instituicao uint `gorm:"not null" json:"id_instituicao"`
	Id_empresa     uint `gorm:"not null" json:"id_empresa"`
	createdAt      time.Time
}