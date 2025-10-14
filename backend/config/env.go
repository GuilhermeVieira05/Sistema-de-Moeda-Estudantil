package config

import (
	"log"
	"os"
	"path/filepath"

	"github.com/joho/godotenv"
)

type Config struct {
	DatabaseURL  string
	JWTSecret    string
	SMTPHost     string
	SMTPPort     string
	SMTPUser     string
	SMTPPassword string
	FrontendURL  string
}

// Função principal para carregar a configuração
func LoadConfig() *Config {

	// Detecta o diretório base do projeto
	wd, err := os.Getwd()
	if err != nil {
		log.Fatalf("❌ Erro ao obter diretório de trabalho: %v", err)
	}

	// Caminho absoluto do .env
	envPath := filepath.Join(wd, "..", ".env")

	if err := godotenv.Load(envPath); err != nil {
		log.Printf("⚠️  Aviso: arquivo .env não encontrado em %s, usando variáveis do ambiente.\n", envPath)
	} else {
		log.Printf("✅ Arquivo .env carregado de: %s\n", envPath)
	}

	cfg := &Config{
		DatabaseURL:  getEnv("DATABASE_URL", ""),
		JWTSecret:    getEnv("JWT_SECRET", ""),
		SMTPHost:     getEnv("SMTP_HOST", ""),
		SMTPPort:     getEnv("SMTP_PORT", "587"), // porta padrão SMTP
		SMTPUser:     getEnv("SMTP_USER", ""),
		SMTPPassword: getEnv("SMTP_PASSWORD", ""),
		FrontendURL:  getEnv("FRONTEND_URL", ""),
	}

	return cfg
}

// Função auxiliar que busca uma variável de ambiente com valor padrão
func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
