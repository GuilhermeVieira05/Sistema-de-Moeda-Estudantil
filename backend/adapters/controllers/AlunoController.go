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

func (h *AlunoController) UpdatePerfil(c *gin.Context) {
	userID := c.GetUint("user_id")

	var input services.UpdateAlunoInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updatedAluno, err := h.alunoService.UpdateAlunoPerfil(userID, &input)
	if err != nil {
		if err.Error() == "email já está em uso por outra conta" || err.Error() == "CPF já está em uso por outra conta" {
			c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao atualizar perfil"})
		return
	}

	c.JSON(http.StatusOK, updatedAluno)
}

func (h *AlunoController) DeletePerfil(c *gin.Context) {
	userID := c.GetUint("user_id")

	if err := h.alunoService.DeleteAlunoPerfil(userID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Aluno e usuário associado deletados com sucesso"})
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