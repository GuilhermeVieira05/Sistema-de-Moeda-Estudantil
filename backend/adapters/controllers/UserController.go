package controllers

import (
	"backend/application/model"
	"backend/application/services"
	"net/http"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type UserController struct {
	userService    *services.UserService
	alunoService   *services.AlunoService
	empresaService *services.EmpresaParceiraService
}

func NewUserController(userService *services.UserService, alunoService *services.AlunoService, empresaService *services.EmpresaParceiraService) *UserController {
    return &UserController{
        userService:    userService,
        alunoService:   alunoService,
        empresaService: empresaService,
    }
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type RegisterAlunoRequest struct {
	Email               string `json:"email" binding:"required,email"`
	Password            string `json:"password" binding:"required,min=6"`
	Nome                string `json:"nome" binding:"required"`
	CPF                 string `json:"cpf" binding:"required"`
	RG                  string `json:"rg"`
	Endereco            string `json:"endereco"`
	InstituicaoEnsinoID uint   `json:"instituicao_ensino_id" binding:"required"`
	Curso               string `json:"curso" binding:"required"`
}

type RegisterEmpresaRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
	Nome     string `json:"nome" binding:"required"`
	CNPJ     string `json:"cnpj" binding:"required"`
	Endereco string `json:"endereco"`
}

func (h *UserController) Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	token, user, err := h.userService.Login(req.Email, req.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token": token,
		"user":  user,
	})
}

func (h *UserController) RegisterAluno(c *gin.Context) {
	var req RegisterAlunoRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Executar transação
	err := h.userService.DB.Transaction(func(tx *gorm.DB) error {
		// Criar usuário
		hashSenha, _ := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
		user := &model.User{
			Email:        req.Email,
			PasswordHash: string(hashSenha),
			Role:         "aluno",
		}
		if err := tx.Create(user).Error; err != nil {
			return err
		}

		// Criar aluno
		aluno := &model.Aluno{
			UserID:             user.ID,
			Nome:               req.Nome,
			CPF:                req.CPF,
			RG:                 req.RG,
			Endereco:           req.Endereco,
			Curso:              req.Curso,
			InstituicaoEnsinoID: req.InstituicaoEnsinoID,
		}
		if err := tx.Create(aluno).Error; err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Aluno criado com sucesso"})
}




func (h *UserController) RegisterEmpresa(c *gin.Context) {
	var req RegisterEmpresaRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Executar transação
	err := h.userService.DB.Transaction(func(tx *gorm.DB) error {
		// Criar usuário
		hashSenha, _ := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
		user := &model.User{
			Email:        req.Email,
			PasswordHash: string(hashSenha),
			Role:         "empresa",
		}
		if err := tx.Create(user).Error; err != nil {
			return err
		}

		// Criar empresa
		empresa := &model.EmpresaParceira{
			UserID:   user.ID,
			Nome:     req.Nome,
			CNPJ:     req.CNPJ,
			Endereco: req.Endereco,
		}
		if err := tx.Create(empresa).Error; err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Gerar token
	token, _, err := h.userService.Login(req.Email, req.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao gerar token"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Empresa cadastrada com sucesso",
		"token":   token,
	})
}

