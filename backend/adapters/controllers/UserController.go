package controllers

import (
	"backend/application/services"
	"backend/application/model"
	"net/http"

	"github.com/gin-gonic/gin"
)

type UserController struct {
	userService    *services.UserService
	alunoService   *services.AlunoService
	empresaService *services.EmpresaParceiraService
}

func NewUserController(userService *services.UserService, alunoService *services.AlunoService) *UserController {
    return &UserController{
        userService:  userService,
        alunoService: alunoService,
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

    // Criar usuário primeiro
    user, err := h.userService.CreateUser(req.Email, req.Password, "aluno")
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // Criar aluno associado ao usuário
    aluno := &model.Aluno{
        UserID:   user.ID,
        Nome:     req.Nome,
        CPF:      req.CPF,
        RG:       req.RG,
        Endereco: req.Endereco,
        Curso:    req.Curso,
		InstituicaoEnsinoID: req.InstituicaoEnsinoID,    
	}

    if err := h.alunoService.CreateAluno(aluno); err != nil {
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

	// Criar usuário
	user, err := h.userService.CreateUser(req.Email, req.Password, "empresa")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Criar empresa
	empresa := &model.EmpresaParceira{
		UserID:   user.ID,
		Nome:     req.Nome,
		CNPJ:     req.CNPJ,
		Endereco: req.Endereco,
	}

	if err := h.empresaService.CreateEmpresa(empresa); err != nil {
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
		"user":    user,
	})
}
