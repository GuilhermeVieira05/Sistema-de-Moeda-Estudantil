package controllers

import (
	"backend/adapters/repositories"
	"net/http"

	"github.com/gin-gonic/gin"
)

type InstituicaoEnsinoController struct {
	instituicaoRepo *repositories.InstituicaoEnsinoRepository
}

func NewInstituicaoEnsinoController(instituicaoRepo *repositories.InstituicaoEnsinoRepository) *InstituicaoEnsinoController {
	return &InstituicaoEnsinoController{instituicaoRepo: instituicaoRepo}
}

func (h *InstituicaoEnsinoController) ListInstituicoes(c *gin.Context) {
	instituicoes, err := h.instituicaoRepo.List()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, instituicoes)
}
