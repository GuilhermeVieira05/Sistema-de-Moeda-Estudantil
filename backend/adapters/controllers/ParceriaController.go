// backend/application/controllers/parceria_controller.go
package controllers

import (
	"backend/application/services"
	"backend/application/utils"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type ParceriaController struct {
	service *services.ParceriaService
}

func NewParceriaController(s *services.ParceriaService) *ParceriaController {
	return &ParceriaController{
		service: s,
	}
}

// Rota: GET /api/parcerias/instituicao
func (ctrl *ParceriaController) GetParceriasByInstituicao(c *gin.Context) {
	// A instituição logada lista suas parcerias
	instituicaoID, err := utils.GetInstituicaoIDFromContext(c) // Precisa estar logado como instituição
	if err != nil {
		utils.SendError(c, http.StatusUnauthorized, "Usuário (Instituição) não autorizado")
		return
	}

	parcerias, err := ctrl.service.ListParceriasByInstituicao(instituicaoID)
	if err != nil {
		utils.SendError(c, http.StatusInternalServerError, "Erro ao listar parcerias")
		return
	}
	c.JSON(http.StatusOK, parcerias)
}

// Rota: GET /api/parcerias/empresa
func (ctrl *ParceriaController) GetParceriasByEmpresa(c *gin.Context) {
	// A empresa logada lista suas parcerias
	empresaID, err := utils.GetEmpresaIDFromContext(c) // Precisa estar logado como empresa
	if err != nil {
		utils.SendError(c, http.StatusUnauthorized, "Usuário (Empresa) não autorizado")
		return
	}

	parcerias, err := ctrl.service.ListParceriasByEmpresa(empresaID)
	if err != nil {
		utils.SendError(c, http.StatusInternalServerError, "Erro ao listar parcerias")
		return
	}
	c.JSON(http.StatusOK, parcerias)
}

// Rota: POST /api/parcerias/empresa/:id
func (ctrl *ParceriaController) SolicitarParceria(c *gin.Context) {
	// A instituição logada solicita parceria com uma empresa
	instituicaoID, err := utils.GetInstituicaoIDFromContext(c)
	if err != nil {
		utils.SendError(c, http.StatusUnauthorized, "Usuário (Instituição) não autorizado")
		return
	}

	empresaID, err := strconv.ParseUint(c.Param("id"), 10, 32)
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

// Rota: DELETE /api/parcerias/empresa/:id
func (ctrl *ParceriaController) RemoverParceria(c *gin.Context) {
	// A instituição logada remove uma parceria
	instituicaoID, err := utils.GetInstituicaoIDFromContext(c)
	if err != nil {
		utils.SendError(c, http.StatusUnauthorized, "Usuário (Instituição) não autorizado")
		return
	}

	empresaID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.SendError(c, http.StatusBadRequest, "ID da empresa inválido")
		return
	}

	if err := ctrl.service.DeleteParceria(instituicaoID, uint(empresaID)); err != nil {
		utils.SendError(c, http.StatusNotFound, err.Error())
		return
	}
	c.Status(http.StatusNoContent)
}