package config

import (
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func ConnectDatabase() {
	var err error

	url := os.Getenv("DATABASE_URL")

	DB, err = gorm.Open(postgres.Open(url), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})

	if err != nil {
		log.Fatalf("Falha ao conectar com o banco de dados PostgreSQL: %v", err)
	}
	
    log.Println("Conexão com o banco de dados PostgreSQL estabelecida com sucesso!")
}