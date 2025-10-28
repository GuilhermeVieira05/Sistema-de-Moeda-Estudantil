package controllers

import (
	"backend/application/model"   
	"backend/application/services" 
	"backend/application/utils"
	"backend/application/dto"   
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type InstituicaoController struct {
	service *services.InstituicaoService
}

func NewInstituicaoController(s *services.InstituicaoService) *InstituicaoController {
	return &InstituicaoController{
		service: s,
	}
}

// Rota: GET /api/instituicoes
func (ctrl *InstituicaoController) ListInstituicoes(c *gin.Context) {
	instituicoes, err := ctrl.service.ListInstituicoes()
	if err != nil {
		utils.SendError(c, http.StatusInternalServerError, "Erro ao listar instituições")
		return
	}
	c.JSON(http.StatusOK, instituicoes)
}

// Rota: GET /api/instituicao/perfil
func (ctrl *InstituicaoController) GetPerfil(c *gin.Context) {
	instituicaoID, err := utils.GetInstituicaoIDFromContext(c)
	if err != nil {
		utils.SendError(c, http.StatusUnauthorized, "Usuário não autorizado")
		return
	}

	perfil, err := ctrl.service.GetInstituicaoByID(instituicaoID)
	if err != nil {
		utils.SendError(c, http.StatusNotFound, "Perfil da instituição não encontrado")
		return
	}

	c.JSON(http.StatusOK, perfil)
}

// Rota: PUT /api/instituicao
func (ctrl *InstituicaoController) AtualizarInstituicao(c *gin.Context) {
	instituicaoID, err := utils.GetInstituicaoIDFromContext(c)
	if err != nil {
		utils.SendError(c, http.StatusUnauthorized, "Usuário não autorizado")
		return
	}

	var input model.InstituicaoEnsino // Ou um DTO de atualização
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.SendError(c, http.StatusBadRequest, "Dados de entrada inválidos")
		return
	}

	updatedPerfil, err := ctrl.service.UpdateInstituicao(instituicaoID, &input)
	if err != nil {
		utils.SendError(c, http.StatusInternalServerError, "Erro ao atualizar perfil")
		return
	}

	c.JSON(http.StatusOK, updatedPerfil)
}

// Rota: POST /api/instituicao/professores
func (ctrl *InstituicaoController) RegisterProfessor(c *gin.Context) {
	instituicaoID, err := utils.GetInstituicaoIDFromContext(c)
	if err != nil {
		utils.SendError(c, http.StatusUnauthorized, "Usuário não autorizado")
		return
	}

	var input dto.RegisterProfessorInput
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.SendError(c, http.StatusBadRequest, "Dados de entrada inválidos")
		return
	}

	professor, err := ctrl.service.RegisterProfessor(instituicaoID, &input)
	if err != nil {
		// O serviço deve tratar erros como "email/cpf já existe"
		utils.SendError(c, http.StatusConflict, err.Error())
		return
	}

	c.JSON(http.StatusCreated, professor)
}

// Rota: GET /api/instituicao/professores
func (ctrl *InstituicaoController) ListProfessores(c *gin.Context) {
	instituicaoID, err := utils.GetInstituicaoIDFromContext(c)
	if err != nil {
		utils.SendError(c, http.StatusUnauthorized, "Usuário não autorizado")
		return
	}

	professores, err := ctrl.service.ListProfessoresByInstituicao(instituicaoID)
	if err != nil {
		utils.SendError(c, http.StatusInternalServerError, "Erro ao listar professores")
		return
	}

	c.JSON(http.StatusOK, professores)
}

// Rota: GET /api/instituicao/professores/:id
func (ctrl *InstituicaoController) GetProfessor(c *gin.Context) {
	instituicaoID, err := utils.GetInstituicaoIDFromContext(c)
	if err != nil {
		utils.SendError(c, http.StatusUnauthorized, "Usuário não autorizado")
		return
	}

	professorID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.SendError(c, http.StatusBadRequest, "ID do professor inválido")
		return
	}

	professor, err := ctrl.service.GetProfessorByID(instituicaoID, uint(professorID))
	if err != nil {
		utils.SendError(c, http.StatusNotFound, "Professor não encontrado")
		return
	}

	c.JSON(http.StatusOK, professor)
}

// Rota: PUT /api/instituicao/professores/:id
func (ctrl *InstituicaoController) UpdateProfessor(c *gin.Context) {
	instituicaoID, err := utils.GetInstituicaoIDFromContext(c)
	if err != nil {
		utils.SendError(c, http.StatusUnauthorized, "Usuário não autorizado")
		return
	}

	professorID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.SendError(c, http.StatusBadRequest, "ID do professor inválido")
		return
	}

	var input dto.UpdateProfessorInput // DTO de atualização
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.SendError(c, http.StatusBadRequest, "Dados de entrada inválidos")
		return
	}

	// O serviço deve verificar a permissão e atualizar o professor
	professor, err := ctrl.service.UpdateProfessor(instituicaoID, uint(professorID), &input)
	if err != nil {
		utils.SendError(c, http.StatusInternalServerError, "Erro ao atualizar professor")
		return
	}

	c.JSON(http.StatusOK, professor)
}

// Rota: DELETE /api/instituicao/professores/:id
func (ctrl *InstituicaoController) DeleteProfessor(c *gin.Context) {
	instituicaoID, err := utils.GetInstituicaoIDFromContext(c)
	if err != nil {
		utils.SendError(c, http.StatusUnauthorized, "Usuário não autorizado")
		return
	}

	professorID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.SendError(c, http.StatusBadRequest, "ID do professor inválido")
		return
	}

	// O serviço deve verificar a permissão e deletar o professor
	if err := ctrl.service.DeleteProfessor(instituicaoID, uint(professorID)); err != nil {
		utils.SendError(c, http.StatusInternalServerError, "Erro ao deletar professor")
		return
	}

	c.Status(http.StatusNoContent)
}

// ListParcerias lista todas as parcerias da instituição.
// Rota: GET /api/instituicao/parcerias
func (ctrl *InstituicaoController) ListParcerias(c *gin.Context) {
	instituicaoID, err := utils.GetInstituicaoIDFromContext(c)
	if err != nil {
		utils.SendError(c, http.StatusUnauthorized, "Usuário não autorizado")
		return
	}

	parcerias, err := ctrl.service.ListParcerias(instituicaoID)
	if err != nil {
		utils.SendError(c, http.StatusInternalServerError, "Erro ao listar parcerias")
		return
	}

	c.JSON(http.StatusOK, parcerias)
}

// SolicitarParceria cria uma nova solicitação de parceria.
// Rota: POST /api/instituicao/parcerias/solicitar/:empresa_id
func (ctrl *InstituicaoController) SolicitarParceria(c *gin.Context) {
	instituicaoID, err := utils.GetInstituicaoIDFromContext(c)
	if err != nil {
		utils.SendError(c, http.StatusUnauthorized, "Usuário não autorizado")
		return
	}

	empresaID, err := strconv.ParseUint(c.Param("empresa_id"), 10, 32)
	if err != nil {
		utils.SendError(c, http.StatusBadRequest, "ID da empresa inválido")
		return
	}

	parceria, err := ctrl.service.CreateParceria(instituicaoID, uint(empresaID))
	if err != nil {
		utils.SendError(c, http.StatusConflict, err.Error()) // Ex: "Parceria já existe"
		return
	}

	c.JSON(http.StatusCreated, parceria)
}

// RemoverParceria deleta uma parceria existente.
// Rota: DELETE /api/instituicao/parcerias/:empresa_id
func (ctrl *InstituicaoController) RemoverParceria(c *gin.Context) {
	instituicaoID, err := utils.GetInstituicaoIDFromContext(c)
	if err != nil {
		utils.SendError(c, http.StatusUnauthorized, "Usuário não autorizado")
		return
	}

	empresaID, err := strconv.ParseUint(c.Param("empresa_id"), 10, 32)
	if err != nil {
		utils.SendError(c, http.StatusBadRequest, "ID da empresa inválido")
		return
	}

	if err := ctrl.service.DeleteParceria(instituicaoID, uint(empresaID)); err != nil {
		utils.SendError(c, http.StatusInternalServerError, "Erro ao remover parceria")
		return
	}

	c.Status(http.StatusNoContent)
}