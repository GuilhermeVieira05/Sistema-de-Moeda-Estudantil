package routes

import (
	"backend/container"
	"backend/middlewares"

	"github.com/gin-gonic/gin"
)

// SetupRoutes registra todas as rotas públicas e protegidas
func SetupRoutes(r *gin.Engine, c *container.Container) {

	// ROTAS PÚBLICAS
	public := r.Group("/api")
	{
		public.POST("/auth/login", c.UserController.Login)
		public.POST("/auth/register/aluno", c.UserController.RegisterAluno)
		public.POST("/auth/register/empresa", c.UserController.RegisterEmpresa)
		public.GET("/instituicoes", c.InstituicaoController.ListInstituicoes)
		public.GET("/vantagens", c.VantagemController.ListVantagens)
	}

	// ROTAS PROTEGIDAS (com JWT)
	protected := r.Group("/api")
	protected.Use(middlewares.AuthMiddleware(c.Config.JWTSecret))
	{
		// ===========================
		// ROTAS DE ALUNO
		// ===========================
		aluno := protected.Group("/aluno")
		aluno.Use(middlewares.RoleMiddleware("aluno"))
		{
			aluno.GET("/perfil", c.AlunoController.GetPerfil)
			aluno.GET("/extrato", c.AlunoController.GetExtrato)
			aluno.POST("/resgatar-vantagem", c.VantagemController.ResgatarVantagem)
		}

		// ===========================
		// ROTAS DE PROFESSOR
		// ===========================
		professor := protected.Group("/professor")
		professor.Use(middlewares.RoleMiddleware("professor"))
		{
			professor.GET("/perfil", c.ProfessorController.GetPerfil)
			professor.GET("/extrato", c.ProfessorController.GetExtrato)
			professor.POST("/enviar-moedas", c.ProfessorController.EnviarMoedas)
			professor.GET("/alunos", c.AlunoController.ListAlunos)
		}

		// ===========================
		// ROTAS DE EMPRESA PARCEIRA
		// ===========================
		empresa := protected.Group("/empresa")
		empresa.Use(middlewares.RoleMiddleware("empresa"))
		{
			empresa.GET("/perfil", c.EmpresaController.GetPerfil)
			empresa.PUT("", c.EmpresaController.AtualizarEmpresa)
			empresa.POST("/vantagens", c.EmpresaController.CriarVantagem)
			empresa.PUT("/vantagens/:id", c.EmpresaController.AtualizarVantagem)
			empresa.DELETE("/vantagens/:id", c.EmpresaController.DeletarVantagem)
			empresa.GET("/vantagens", c.EmpresaController.ListVantagens)
			empresa.GET("/resgates", c.EmpresaController.ListResgates)
		}
	}
}
