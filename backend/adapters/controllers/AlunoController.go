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

type UpdateSaldoRequest struct {
    Valor int `json:"valor" binding:"required"` 
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

func (c *AlunoController) UpdateSaldo(ctx *gin.Context) {
    userID := ctx.GetUint("user_id") // vem do JWT

    // Faz o parse do body
    var req UpdateSaldoRequest
    if err := ctx.ShouldBindJSON(&req); err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": "Requisição inválida: " + err.Error()})
        return
    }

    // Atualiza o saldo do aluno pelo user_id
    err := c.alunoService.UpdateSaldoByUserID(userID, req.Valor)
    if err != nil {
        if err.Error() == "saldo insuficiente" {
            ctx.JSON(http.StatusConflict, gin.H{"error": "Saldo insuficiente"})
            return
        }
        ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao atualizar saldo: " + err.Error()})
        return
    }

    // Busca o aluno atualizado pelo user_id
    aluno, err := c.alunoService.GetAlunoByUserID(userID)
    if err != nil {
         ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Saldo atualizado, mas falha ao buscar perfil"})
         return
    }

    ctx.JSON(http.StatusOK, aluno)
}
