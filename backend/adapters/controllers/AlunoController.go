package controllers

import (
	"backend/application/services"
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

func (h *AlunoController) ListAlunos(c *gin.Context) {
	alunos, err := h.alunoService.ListAlunos()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, alunos)
}
