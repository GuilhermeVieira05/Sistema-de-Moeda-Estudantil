package cmd

import (
	"backend/config"
	"github.com/gin-gonic/gin"
)

func Main() {
	config.ConnectDatabase()

	err := config.DB.AutoMigrate()
	if err != nil {
		panic("Falha ao migrar o banco de dados: " + err.Error())
	}

	r := gin.Default()

	r.Run(":8080") 
}