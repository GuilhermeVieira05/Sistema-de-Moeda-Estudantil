package services

import (
	"backend/config"
	"fmt"
	"net/smtp"
)

type EmailService struct {
	config *config.Config
}

func NewEmailService(cfg *config.Config) *EmailService {
	return &EmailService{config: cfg}
}

func (s *EmailService) SendEmail(to, subject, body string) error {
	from := s.config.SMTPUser
	password := s.config.SMTPPassword

	// Configurar autenticação
	auth := smtp.PlainAuth("", from, password, s.config.SMTPHost)

	// Montar mensagem
	msg := []byte(fmt.Sprintf("To: %s\r\n"+
		"Subject: %s\r\n"+
		"Content-Type: text/html; charset=UTF-8\r\n"+
		"\r\n"+
		"%s\r\n", to, subject, body))

	// Enviar email
	addr := fmt.Sprintf("%s:%s", s.config.SMTPHost, s.config.SMTPPort)
	err := smtp.SendMail(addr, auth, from, []string{to}, msg)
	if err != nil {
		return fmt.Errorf("erro ao enviar email: %w", err)
	}

	return nil
}

func (s *EmailService) SendMoedasRecebidas(toEmail, alunoNome, professorNome string, valor int, motivo string) error {
	subject := "Você recebeu moedas!"
	body := fmt.Sprintf(`
		<html>
		<body>
			<h2>Olá, %s!</h2>
			<p>Você recebeu <strong>%d moedas</strong> do professor <strong>%s</strong>.</p>
			<p><strong>Motivo:</strong> %s</p>
			<p>Acesse o sistema para verificar seu saldo e trocar por vantagens!</p>
		</body>
		</html>
	`, alunoNome, valor, professorNome, motivo)

	return s.SendEmail(toEmail, subject, body)
}

func (s *EmailService) SendCupomResgate(toEmail, alunoNome, vantagemTitulo, codigoCupom string) error {
	subject := "Cupom de Resgate - " + vantagemTitulo
	body := fmt.Sprintf(`
		<html>
		<body>
			<h2>Olá, %s!</h2>
			<p>Seu resgate foi realizado com sucesso!</p>
			<p><strong>Vantagem:</strong> %s</p>
			<p><strong>Código do Cupom:</strong> <span style="font-size: 20px; font-weight: bold; color: #007bff;">%s</span></p>
			<p>Apresente este código no estabelecimento parceiro para utilizar sua vantagem.</p>
		</body>
		</html>
	`, alunoNome, vantagemTitulo, codigoCupom)

	return s.SendEmail(toEmail, subject, body)
}

func (s *EmailService) SendNotificacaoEmpresa(toEmail, empresaNome, alunoNome, vantagemTitulo, codigoCupom string) error {
	subject := "Novo Resgate de Vantagem"
	body := fmt.Sprintf(`
		<html>
		<body>
			<h2>Olá, %s!</h2>
			<p>Um aluno realizou o resgate de uma vantagem.</p>
			<p><strong>Aluno:</strong> %s</p>
			<p><strong>Vantagem:</strong> %s</p>
			<p><strong>Código do Cupom:</strong> <span style="font-size: 20px; font-weight: bold; color: #007bff;">%s</span></p>
			<p>Aguarde a apresentação deste código para validar o resgate.</p>
		</body>
		</html>
	`, empresaNome, alunoNome, vantagemTitulo, codigoCupom)

	return s.SendEmail(toEmail, subject, body)
}
