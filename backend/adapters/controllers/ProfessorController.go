package controllers

import (
	"backend/application/services"
	"fmt"
	"net/http"
	"github.com/gin-gonic/gin"
)

type ProfessorController struct {
	service *services.ProfessorService
}

func NewProfessorController(s *services.ProfessorService) *ProfessorController {
	return &ProfessorController{
		service: s,
	}
}

// Rota: GET /api/professor/perfil
func (ctrl *ProfessorController) GetPerfil(c *gin.Context) {
	// Pega o userID do professor logado (definido pelo middleware de auth)
	userID := c.GetUint("user_id")

	perfil, err := ctrl.service.GetPerfil(userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Perfil do professor não encontrado"})
		return
	}
	c.JSON(http.StatusOK, perfil)
}

// Rota: GET /api/professor/extrato
func (ctrl *ProfessorController) GetExtrato(c *gin.Context) {
	// Pega o userID do professor logado
	userID := c.GetUint("user_id")

	// O service deve ser capaz de buscar o extrato a partir do userID
	extrato, err := ctrl.service.GetExtrato(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar extrato: " + err.Error()})
		return
	}
	c.JSON(http.StatusOK, extrato)
}

// Rota: POST /api/professor/enviar-moedas
func (ctrl *ProfessorController) EnviarMoedas(c *gin.Context) {
	// Pega o userID do professor logado (quem está enviando)
	userID := c.GetUint("user_id")
	userID = 22

	fmt.Print("UserID do professor logado:", userID)
	// var idOriginal int = 22
	// idUint := uint(idOriginal) 

	// CORRIGIDO: Usa o DTO 'EnviarMoedasInput' definido no package 'services'.
	// Esse DTO agora inclui 'Motivo'.
	var input services.EnviarMoedasInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados de entrada inválidos: " + err.Error()})
		return
	}

	// O service aceitará o input (com AlunoID, Valor e Motivo)
	transacao, err := ctrl.service.EnviarMoedas(userID, &input)
	if err != nil {
		// Segue o padrão do AlunoController.UpdateSaldo para erros específicos
		if err.Error() == "saldo insuficiente" {
			c.JSON(http.StatusConflict, gin.H{"error": "Saldo insuficiente"})
			return
		}

		// Erro genérico do serviço
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao enviar moedas: " + err.Error()})
		return
	}
	
	c.JSON(http.StatusCreated, transacao)
}