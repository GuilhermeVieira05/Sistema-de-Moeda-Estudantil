package controllers

import (
	"backend/application/model"
	"backend/application/services"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type EmpresaParceiraController struct {
	empresaService  *services.EmpresaParceiraService
	vantagemService *services.VantagemService
}

func NewEmpresaParceiraController(empresaService *services.EmpresaParceiraService, vantagemService *services.VantagemService) *EmpresaParceiraController {
	return &EmpresaParceiraController{
		empresaService:  empresaService,
		vantagemService: vantagemService,
	}
}

func (h *EmpresaParceiraController) GetPerfil(c *gin.Context) {
	userID := c.GetUint("user_id")

	empresa, err := h.empresaService.GetEmpresaByUserID(userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Empresa não encontrada"})
		return
	}

	c.JSON(http.StatusOK, empresa)
}

type CriarVantagemRequest struct {
	Titulo      string `json:"titulo" binding:"required"`
	Descricao   string `json:"descricao" binding:"required"`
	FotoURL     string `json:"foto_url"`
	CustoMoedas int    `json:"custo_moedas" binding:"required,gt=0"`
}

func (h *EmpresaParceiraController) CriarVantagem(c *gin.Context) {
	userID := c.GetUint("user_id")

	var req CriarVantagemRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	empresa, err := h.empresaService.GetEmpresaByUserID(userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Empresa não encontrada"})
		return
	}

	vantagem := &model.Vantagem{
		EmpresaParceiraID: empresa.ID,
		Titulo:            req.Titulo,
		Descricao:         req.Descricao,
		FotoURL:           req.FotoURL,
		CustoMoedas:       req.CustoMoedas,
		Ativa:             true,
	}

	if err := h.vantagemService.CreateVantagem(vantagem); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":  "Vantagem criada com sucesso",
		"vantagem": vantagem,
	})
}

func (h *EmpresaParceiraController) AtualizarVantagem(c *gin.Context) {
	userID := c.GetUint("user_id")
	vantagemID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	var req CriarVantagemRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	empresa, err := h.empresaService.GetEmpresaByUserID(userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Empresa não encontrada"})
		return
	}

	// Verificar se a vantagem pertence à empresa
	vantagem, err := h.vantagemService.GetVantagemByID(uint(vantagemID))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Vantagem não encontrada"})
		return
	}

	if vantagem.EmpresaParceiraID != empresa.ID {
		c.JSON(http.StatusForbidden, gin.H{"error": "Você não tem permissão para editar esta vantagem"})
		return
	}

	vantagemAtualizada := &model.Vantagem{
		Titulo:      req.Titulo,
		Descricao:   req.Descricao,
		FotoURL:     req.FotoURL,
		CustoMoedas: req.CustoMoedas,
	}

	if err := h.vantagemService.UpdateVantagem(uint(vantagemID), vantagemAtualizada); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Vantagem atualizada com sucesso"})
}

func (h *EmpresaParceiraController) DeletarVantagem(c *gin.Context) {
	userID := c.GetUint("user_id")
	vantagemID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	empresa, err := h.empresaService.GetEmpresaByUserID(userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Empresa não encontrada"})
		return
	}

	// Verificar se a vantagem pertence à empresa
	vantagem, err := h.vantagemService.GetVantagemByID(uint(vantagemID))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Vantagem não encontrada"})
		return
	}

	if vantagem.EmpresaParceiraID != empresa.ID {
		c.JSON(http.StatusForbidden, gin.H{"error": "Você não tem permissão para deletar esta vantagem"})
		return
	}

	if err := h.vantagemService.DeleteVantagem(uint(vantagemID)); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Vantagem deletada com sucesso"})
}

func (h *EmpresaParceiraController) ListVantagens(c *gin.Context) {
	userID := c.GetUint("user_id")

	empresa, err := h.empresaService.GetEmpresaByUserID(userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Empresa não encontrada"})
		return
	}

	vantagens, err := h.vantagemService.ListVantagensByEmpresa(empresa.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, vantagens)
}

func (h *EmpresaParceiraController) ListResgates(c *gin.Context) {
	userID := c.GetUint("user_id")

	empresa, err := h.empresaService.GetEmpresaByUserID(userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Empresa não encontrada"})
		return
	}

	// Este método será implementado no resgate service
	c.JSON(http.StatusOK, gin.H{
		"empresa_id": empresa.ID,
		"message":    "Lista de resgates",
	})
}

func (h *EmpresaParceiraController) AtualizarEmpresa(c *gin.Context) {
	userID := c.GetUint("user_id")
	fmt.Println("UserID:", c)
	var req struct {
		Nome     string `json:"nome"`
		Endereco string `json:"endereco"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "JSON inválido"})
		return
	}

	empresa, err := h.empresaService.GetEmpresaByUserID(userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Empresa não encontrada"})
		return
	}

	empresa.Nome = req.Nome
	empresa.Endereco = req.Endereco

	if err := h.empresaService.UpdateEmpresa(empresa); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao atualizar empresa"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Empresa atualizada com sucesso",
		"empresa": empresa,
	})
}
