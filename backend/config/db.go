package config

import (
	"backend/application/model"
	"fmt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	"log"
)

func Connect(cfg *Config) (*gorm.DB, error) {

	databaseURL := cfg.DatabaseURL

	if databaseURL == "" {
		return nil, fmt.Errorf("a variável de ambiente DATABASE_URL não foi definida")
	}

	db, err := gorm.Open(postgres.Open(databaseURL), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		return nil, fmt.Errorf("erro ao conectar ao banco de dados: %w", err)
	}

	log.Println("✅ Conexão com o banco de dados estabelecida com sucesso!")
	return db, nil
}

// func RunMigrations(db *gorm.DB) error {
// 	return db.AutoMigrate(
// 		&model.User{},
// 		&model.InstituicaoEnsino{},
// 		&model.Aluno{},
// 		&model.Professor{},
// 		&model.EmpresaParceira{},
// 		&model.Vantagem{},
// 		&model.TransacaoMoeda{},
// 		&model.ResgateVantagem{},
// 	)
// }

func RunMigrations(db *gorm.DB) error {
	tables := []interface{}{
		&model.InstituicaoEnsino{},
		&model.Aluno{},
		&model.Professor{},
		&model.EmpresaParceira{},
		&model.Vantagem{},
		&model.TransacaoMoeda{},
		&model.ResgateVantagem{},
		&model.User{},
	}

	log.Println("🧩 Verificando necessidade de migração...")

	for _, t := range tables {
		has := db.Migrator().HasTable(t)
		if has {
			log.Printf("ℹ️ Tabela já existe, pulando: %T\n", t)
			continue
		} else {
			log.Printf("➕ Criando tabela: %T\n", t)
			if err := db.Migrator().CreateTable(t); err != nil {
				return fmt.Errorf("falha criando tabela %T: %w", t, err)
			}
		}
	}

	log.Println("✅ Migrações concluídas com sucesso (ou já estavam atualizadas).")
	return nil
}
