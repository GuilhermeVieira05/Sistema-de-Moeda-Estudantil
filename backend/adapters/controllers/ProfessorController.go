package controllers

import (
	"backend/application/model"
	"backend/application/services"
	"backend/application/utils"
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
	// Assumindo que o AuthMiddleware coloca "userID" no contexto
	userID, err := utils.GetUserIDFromContext(c) // Você precisará de um GetUserIDFromContext
	if err != nil {
		utils.SendError(c, http.StatusUnauthorized, "Usuário não autorizado")
		return
	}

	perfil, err := ctrl.service.GetPerfil(userID)
	if err != nil {
		utils.SendError(c, http.StatusNotFound, "Perfil do professor não encontrado")
		return
	}
	c.JSON(http.StatusOK, perfil)
}

// Rota: GET /api/professor/extrato
func (ctrl *ProfessorController) GetExtrato(c *gin.Context) {
	// Precisamos do ID do *Professor*, não do User
	professorID, err := utils.GetProfessorIDFromContext(c) // Função nova no utils
	if err != nil {
		utils.SendError(c, http.StatusUnauthorized, "Usuário (Professor) não autorizado")
		return
	}

	extrato, err := ctrl.service.GetExtrato(professorID)
	if err != nil {
		utils.SendError(c, http.StatusInternalServerError, "Erro ao buscar extrato")
		return
	}
	c.JSON(http.StatusOK, extrato)
}

// Rota: POST /api/professor/enviar-moedas
func (ctrl *ProfessorController) EnviarMoedas(c *gin.Context) {
	professorID, err := utils.GetProfessorIDFromContext(c)
	if err != nil {
		utils.SendError(c, http.StatusUnauthorized, "Usuário (Professor) não autorizado")
		return
	}

	var input model.EnviarMoedasInput // Você precisa criar este DTO
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.SendError(c, http.StatusBadRequest, "Dados de entrada inválidos")
		return
	}

	transacao, err := ctrl.service.EnviarMoedas(professorID, &input)
	if err != nil {
		// O service retorna erros específicos (ex: "Saldo insuficiente")
		utils.SendError(c, http.StatusConflict, err.Error())
		return
	}

	c.JSON(http.StatusCreated, transacao)
}

// NOTA: A rota /api/professor/alunos chama o c.AlunoController.ListAlunos
// Você precisará garantir que o AlunoController.ListAlunos
// filtre os alunos pela instituição do professor logado.