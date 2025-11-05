package emailsender

import (
	"backend/config"
	"fmt"
	"strconv"

	"gopkg.in/gomail.v2"
)

func SendEmail(sender string, emailDestino string, tipo string, valor int) {

	cfg := config.LoadConfig()

	host := cfg.SMTPHost
	port, err := strconv.Atoi(cfg.SMTPPort)
	if err != nil {
		panic(fmt.Sprintf("Erro ao converter porta SMTP: %v", err))
	}
	user := cfg.SMTPUser
	password := cfg.SMTPPassword

	msg := gomail.NewMessage()
	msg.SetHeader("From", sender)
	msg.SetHeader("To", emailDestino)

	if tipo == "moeda" {
		msg.SetHeader("Subject", fmt.Sprintf("🎉 Parabéns! Você recebeu %d moedas do seu professor!", valor))
	}

	msg.SetBody("text/html", `
	<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f5f5f5;padding:20px 0;">
	<tr>
	  <td align="center">
		<table width="400" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;border-radius:10px;padding:20px;text-align:center;font-family:Arial, sans-serif;">
		  <tr>
			<td>
			  <h2 style="color:#333;">🎉 Parabéns!</h2>
			  <p style="font-size:16px;color:#555;">Você recebeu moedas do seu professor!</p>
			  <img src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExNm9wb2RhZXp3N2F5MnM4bWQ1NTB1MTM5c2Jza2k3bnVmYm92NXlueiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/13kdbpQWKWKjQI/giphy.gif" 
				   alt="club penguin gif" 
				   width="300" 
				   style="display:block;margin:0 auto;border-radius:8px;" />
			  <p style="font-size:14px;color:#888;">Continue se esforçando! 💪</p>
			</td>
		  </tr>
		</table>
	  </td>
	</tr>
  </table>
	`)
	

	dialer := gomail.NewDialer(host, port, user, password)

	if err := dialer.DialAndSend(msg); err != nil {
		fmt.Println("Failed to send email:", err)
	} else {
		fmt.Println("Email sent successfully")
	}
}
