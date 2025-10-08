"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import AuthLayout from "@/components/auth-layout"
import TextField from "@/components/text-field"
import Button from "@/components/button"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulação de login - em produção, fazer chamada à API
    setTimeout(() => {
      // Mock: redirecionar baseado no email
      if (email.includes("admin")) {
        router.push("/admin/dashboard")
      } else if (email.includes("aluno")) {
        router.push("/student/dashboard")
      } else if (email.includes("professor")) {
        router.push("/professor/dashboard")
      } else if (email.includes("empresa")) {
        router.push("/company/dashboard")
      } else {
        router.push("/student/dashboard")
      }
    }, 1000)
  }

  return (
    <AuthLayout title="Bem-vindo de volta" subtitle="Entre com suas credenciais para acessar sua conta">
      <form onSubmit={handleSubmit}>
        <TextField label="Email" type="email" value={email} onChange={setEmail} placeholder="seu@email.com" required />

        <TextField
          label="Senha"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
          required
        />

        <div className="flex items-center justify-between mb-6">
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            <span className="text-sm text-muted">Lembrar de mim</span>
          </label>

          <Link href="/forgot-password" className="text-sm text-primary hover:underline">
            Esqueceu a senha?
          </Link>
        </div>

        <Button type="submit" fullWidth disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </Button>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted">
            Não tem uma conta?{" "}
            <Link href="/register" className="text-primary font-medium hover:underline">
              Cadastre-se
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  )
}
