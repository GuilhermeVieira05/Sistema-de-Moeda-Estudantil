package controllers

import (
	"backend/application/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

type ProfessorController struct {
	professorService *services.ProfessorService
	transacaoService *services.TransacaoMoedaService
}

func NewProfessorController(professorService *services.ProfessorService, transacaoService *services.TransacaoMoedaService) *ProfessorController {
	return &ProfessorController{
		professorService: professorService,
		transacaoService: transacaoService,
	}
}

func (h *ProfessorController) GetPerfil(c *gin.Context) {
	userID := c.GetUint("user_id")

	professor, err := h.professorService.GetProfessorByUserID(userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Professor não encontrado"})
		return
	}

	c.JSON(http.StatusOK, professor)
}

func (h *ProfessorController) GetExtrato(c *gin.Context) {
	userID := c.GetUint("user_id")

	professor, err := h.professorService.GetProfessorByUserID(userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Professor não encontrado"})
		return
	}

	transacoes, err := h.transacaoService.GetExtratoProfessor(professor.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"professor":  professor,
		"transacoes": transacoes,
	})
}

type EnviarMoedasRequest struct {
	AlunoID uint   `json:"aluno_id" binding:"required"`
	Valor   int    `json:"valor" binding:"required,gt=0"`
	Motivo  string `json:"motivo" binding:"required"`
}

func (h *ProfessorController) EnviarMoedas(c *gin.Context) {
	userID := c.GetUint("user_id")

	var req EnviarMoedasRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	professor, err := h.professorService.GetProfessorByUserID(userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Professor não encontrado"})
		return
	}

	if err := h.transacaoService.EnviarMoedas(professor.ID, req.AlunoID, req.Valor, req.Motivo); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Moedas enviadas com sucesso"})
}
