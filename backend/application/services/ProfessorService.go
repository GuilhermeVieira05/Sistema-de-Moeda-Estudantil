package services

import (
	"backend/adapters/repositories"
	"backend/application/model"
	"errors"
	"backend/emailSender"
	"fmt"
	// "time" // Removido, pois o DB define o DataHora via default
)

// EnviarMoedasInput é o DTO (Data Transfer Object) para o envio de moedas.
// Esta é a versão CORRETA, usando Motivo.
type EnviarMoedasInput struct {
	AlunoID uint   `json:"aluno_id" binding:"required"`
	Valor   int    `json:"valor" binding:"required"`
	Motivo  string `json:"motivo" binding:"required"` // Corresponde ao model.TransacaoMoeda
}

type ProfessorService struct {
	professorRepo *repositories.ProfessorRepository
	alunoRepo     *repositories.AlunoRepository
	transacaoRepo *repositories.TransacaoMoedaRepository
}

func NewProfessorService(
	pRepo *repositories.ProfessorRepository,
	aRepo *repositories.AlunoRepository,
	tRepo *repositories.TransacaoMoedaRepository,
) *ProfessorService {
	return &ProfessorService{
		professorRepo: pRepo,
		alunoRepo:     aRepo,
		transacaoRepo: tRepo,
	}
}

// GetPerfil busca o perfil do professor logado (pelo UserID)
func (s *ProfessorService) GetPerfil(userID uint) (*model.Professor, error) {
	professor, err := s.professorRepo.FindByUserID(userID)
	if err != nil {
		return nil, errors.New("perfil de professor não encontrado")
	}
	return professor, nil
}

// GetExtrato busca o extrato de transações do professor logado (pelo UserID)
func (s *ProfessorService) GetExtrato(userID uint) ([]model.TransacaoMoeda, error) {
	professor, err := s.professorRepo.FindByUserID(userID)
	if err != nil {
		return nil, errors.New("perfil de professor não encontrado")
	}

	return s.transacaoRepo.FindByProfessorID(professor.ID)
}

// EnviarMoedas (Assinatura corrigida para receber userID e o DTO local)
func (s *ProfessorService) EnviarMoedas(userID uint, input *EnviarMoedasInput) (*model.TransacaoMoeda, error) {

	// 1. Busca o professor (remetente) pelo UserID
	professor, err := s.professorRepo.FindByUserID(userID)
	fmt.Print(professor, err, userID)
	if err != nil {
		return nil, errors.New("professor não encontrado")
	}

	// 2. Verifica se o professor tem saldo
	if professor.SaldoMoedas < input.Valor {
		return nil, errors.New("saldo insuficiente")
	}
	if input.Valor <= 0 {
		return nil, errors.New("o valor deve ser positivo")
	}

	// 3. Busca o aluno (destinatário)
	aluno, err := s.alunoRepo.FindByID(input.AlunoID)
	if err != nil {
		return nil, errors.New("aluno não encontrado")
	}

	// --- Transação Removida (Seguindo padrão AlunoService) ---

	// 4. Debita do professor
	professor.SaldoMoedas -= input.Valor
	professor.TotalSend += input.Valor
	if err := s.professorRepo.Update(professor); err != nil {
		return nil, errors.New("erro ao debitar do professor")
	}

	// 5. Credita ao aluno
	aluno.SaldoMoedas += input.Valor
	if err := s.alunoRepo.Update(aluno); err != nil {
		// NOTA: Inconsistência. O professor foi debitado, mas o aluno não foi creditado.
		return nil, errors.New("erro ao creditar ao aluno")
	}

	// 6. Cria o registro da transação
	transacao := &model.TransacaoMoeda{
		ProfessorID: professor.ID,
		AlunoID:     aluno.ID,
		Valor:       input.Valor,
		Motivo:      input.Motivo,
	}

	if err := s.transacaoRepo.Create(transacao); err != nil {
		// NOTA: A transferência ocorreu, mas não foi registrada.
		return nil, errors.New("erro ao registrar transação")
	}

	transacao.Professor = *professor
	transacao.Aluno = *aluno


	emailsender.SendEmail(professor.User.Email,aluno.User.Email,"moeda",input.Valor)
	return transacao, nil
}