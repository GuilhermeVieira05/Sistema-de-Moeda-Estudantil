"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import AuthLayout from "@/components/auth-layout"
import AuthForm from "@/components/auth-form"
import TextField from "@/components/text-field"

export default function Page() {
  const [email, setEmail] = useState("")
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
        body: JSON.stringify({ email, password }),
      })

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
        router.push("/dashboard/empresa")
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
        <TextField label="Email" type="email" value={email} onChange={setEmail} placeholder="seu@email.com" required />
        <TextField label="Senha" type="password" value={password} onChange={setPassword} placeholder="••••••••" required />
      </AuthForm>
    </AuthLayout>
  )
}
