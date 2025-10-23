package controllers

import (
	"backend/application/model"
	"backend/application/services"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

type AlunoController struct {
	alunoService *services.AlunoService
}

func NewAlunoController(alunoService *services.AlunoService) *AlunoController {
	return &AlunoController{alunoService: alunoService}
}

func (h *AlunoController) GetPerfil(c *gin.Context) {
	userID := c.GetUint("user_id")

	aluno, err := h.alunoService.GetAlunoByUserID(userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Aluno não encontrado"})
		return
	}

	c.JSON(http.StatusOK, aluno)
}

func (h *AlunoController) GetExtrato(c *gin.Context) {
	userID := c.GetUint("user_id")

	extrato, err := h.alunoService.GetExtrato(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, extrato)
}

func (h *AlunoController) UpdateAluno(c *gin.Context) {
	userID := c.GetUint("user_id")

	log.Println("UserID, ", userID)
	var alunoInput model.Aluno
	if err := c.ShouldBindJSON(&alunoInput); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos"})
		return
	}

	// Garante que o ID seja o do usuário autenticado
	alunoInput.UserID = userID

	// Busca o aluno atual para garantir que existe
	alunoExistente, err := h.alunoService.GetAlunoByID(userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Aluno não encontrado"})
		return
	}

	// Força o mesmo ID no input
	alunoInput.ID = alunoExistente.ID

	if err := h.alunoService.UpdateAluno(&alunoInput); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao atualizar aluno"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Aluno atualizado com sucesso"})
}

func (h *AlunoController) ListAlunos(c *gin.Context) {
	alunos, err := h.alunoService.ListAlunos()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, alunos)
}
