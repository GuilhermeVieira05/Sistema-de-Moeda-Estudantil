// app/login/page.tsx (Modificado)
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import AuthLayout from "@/components/auth-layout"
import AuthForm from "@/components/auth-form"
import TextField from "@/components/text-field"

export default function Page() {
  const [loginField, setLoginField] = useState("") // Mudei de 'email' para 'loginField'
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // No backend, o handler de login deve verificar se 'login' é email ou cnpj
        body: JSON.stringify({ email: loginField, password }), 
      })
      console.log("Body", loginField, password)
      console.log("Resposta do login:", res)

      const data = await res.json()

      if (!res.ok) {
        alert(data.error || "Erro ao fazer login")
        setLoading(false)
        return
      }

      localStorage.setItem("token", data.token)
      localStorage.setItem("role", data.user.role)

      if (data.user.role === "aluno") {
        router.push("/student/dashboard")
      } else if (data.user.role === "empresa") {
        router.push("/company/dashboard") 
      } else if (data.user.role === "instituicao") {
        router.push("/institution/dashboard")
      } else {
        router.push("/")
      }

    } catch (err) {
      console.error(err)
      alert("Erro ao conectar com o servidor")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Bem-vindo de volta" subtitle="Entre na sua conta para continuar">
      <AuthForm onSubmit={handleSubmit} loading={loading} buttonText="Entrar">
        <TextField 
          label="Email ou CNPJ" 
          type="text" // Mudei o tipo para aceitar CNPJ
          value={loginField} 
          onChange={setLoginField} 
          placeholder="seu@email.com ou 00.000.000/0001-00" // Mudei o placeholder
          required 
        />
        {/* === FIM DA MODIFICAÇÃO === */}
        <TextField 
          label="Senha" 
          type="password" 
          value={password} 
          onChange={setPassword} 
          placeholder="••••••••" 
          required 
        />
      </AuthForm>
    </AuthLayout>
  )
}