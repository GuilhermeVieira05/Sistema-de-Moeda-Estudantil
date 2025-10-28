package controllers

import (
	"backend/application/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

type VantagemController struct {
	vantagemService *services.VantagemService
	resgateService  *services.ResgateVantagemService
}

func NewVantagemController(vantagemService *services.VantagemService, resgateService *services.ResgateVantagemService) *VantagemController {
	return &VantagemController{
		vantagemService: vantagemService,
		resgateService:  resgateService,
	}
}

func (h *VantagemController) ListVantagens(c *gin.Context) {
	vantagens, err := h.vantagemService.ListVantagensAtivas()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, vantagens)
}

type ResgatarVantagemRequest struct {
	VantagemID uint `json:"vantagem_id" binding:"required"`
}

func (h *VantagemController) ResgatarVantagem(c *gin.Context) {
	userID := c.GetUint("user_id")

	var req ResgatarVantagemRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	resgate, err := h.resgateService.ResgatarVantagem(userID, req.VantagemID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Vantagem resgatada com sucesso",
		"resgate": resgate,
	})
}
