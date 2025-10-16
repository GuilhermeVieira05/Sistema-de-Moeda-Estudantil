"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import AuthLayout from "@/components/auth-layout"
import TextField from "@/components/text-field"
import Button from "@/components/button"
import Link from "next/link"

export default function CompanyRegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    companyName: "",
    cnpj: "",
    email: "",
    address: "",
    description: "",
    password: "",
    confirmPassword: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (formData.password !== formData.confirmPassword) {
      alert("As senhas não coincidem")
      setLoading(false)
      return
    }

    setTimeout(() => {
      router.push("/login")
    }, 1000)
  }

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <AuthLayout title="Cadastro de Empresa" subtitle="Torne-se um parceiro e ofereça vantagens aos estudantes">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5">
          <TextField
            label="Nome da Empresa"
            value={formData.companyName}
            onChange={(v) => updateField("companyName", v)}
            placeholder="Empresa LTDA"
            required
          />

          <TextField
            label="CNPJ"
            value={formData.cnpj}
            onChange={(v) => updateField("cnpj", v)}
            placeholder="00.000.000/0000-00"
            required
          />

          <TextField
            label="Email corporativo"
            type="email"
            value={formData.email}
            onChange={(v) => updateField("email", v)}
            placeholder="contato@empresa.com"
            required
          />

          <TextField
            label="Endereço"
            value={formData.address}
            onChange={(v) => updateField("address", v)}
            placeholder="Rua, número, bairro, cidade"
            required
          />

          <TextField
            label="Descrição da empresa"
            value={formData.description}
            onChange={(v) => updateField("description", v)}
            placeholder="Conte um pouco sobre sua empresa..."
            multiline
            rows={4}
            required
          />

          <TextField
            label="Senha"
            type="password"
            value={formData.password}
            onChange={(v) => updateField("password", v)}
            placeholder="••••••••"
            required
          />

          <TextField
            label="Confirmar senha"
            type="password"
            value={formData.confirmPassword}
            onChange={(v) => updateField("confirmPassword", v)}
            placeholder="••••••••"
            required
          />
        </div>
        <Button type="submit" disabled={loading} className="text-white w-full mt-5">
          {loading ? "Criando conta..." : "Criar conta"}
        </Button>

        <div className="mt-6 text-center">
          <p className="text-base text-gray-500">
            Já tem uma conta?{" "}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Faça login
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  )
}
