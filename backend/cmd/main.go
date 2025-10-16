package main

import (
	"backend/adapters/routes"
	"backend/config"
	"backend/container"
	"log"

	"github.com/gin-contrib/cors"
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

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"}, // endereço do frontend
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	routes.SetupRoutes(r, c)
	
	log.Println("🚀 Servidor iniciado na porta 8080")
	r.Run(":8080")
}
