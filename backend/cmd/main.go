package main

import (
	"backend/adapters/routes"
	"backend/config"
	"backend/container"
	"log"

	"github.com/gin-gonic/gin"
)

func main() {
	cfg := config.LoadConfig()

	db, err := config.Connect(cfg)
	if err != nil {
		log.Fatalf("❌ Falha ao conectar ao banco: %v", err)
	}

	if err := config.RunMigrations(db); err != nil {
		log.Fatalf("❌ Falha ao migrar o banco de dados: %v", err)
	}

	c := container.NewContainer(db, cfg)

	r := gin.Default()

	// Inicializa as rotas passando o container inteiro
	routes.SetupRoutes(r, c)
	
	log.Println("🚀 Servidor iniciado na porta 8080")
	r.Run(":8080")
}
