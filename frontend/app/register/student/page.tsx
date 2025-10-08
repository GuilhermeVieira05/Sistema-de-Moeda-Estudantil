"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import AuthLayout from "@/components/auth-layout"
import TextField from "@/components/text-field"
import SelectField from "@/components/select-field"
import Button from "@/components/button"
import Link from "next/link"

const mockInstitutions = [
  { value: "puc", label: "PUC Minas" },
  { value: "ufmg", label: "UFMG" },
  { value: "uemg", label: "UEMG" },
]

const mockCourses = [
  { value: "eng-software", label: "Engenharia de Software" },
  { value: "ciencia-comp", label: "Ciência da Computação" },
  { value: "sistemas-info", label: "Sistemas de Informação" },
  { value: "adm", label: "Administração" },
]

export default function StudentRegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    cpf: "",
    rg: "",
    address: "",
    institution: "",
    course: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Validação básica
    if (formData.password !== formData.confirmPassword) {
      alert("As senhas não coincidem")
      setLoading(false)
      return
    }

    // Simulação de cadastro
    setTimeout(() => {
      router.push("/login")
    }, 1000)
  }

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <AuthLayout title="Cadastro de Aluno" subtitle="Preencha seus dados para criar sua conta">
      <form onSubmit={handleSubmit}>
        <TextField
          label="Nome completo"
          value={formData.name}
          onChange={(v) => updateField("name", v)}
          placeholder="João da Silva"
          required
        />

        <TextField
          label="Email"
          type="email"
          value={formData.email}
          onChange={(v) => updateField("email", v)}
          placeholder="joao@email.com"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="CPF"
            value={formData.cpf}
            onChange={(v) => updateField("cpf", v)}
            placeholder="000.000.000-00"
            required
          />

          <TextField
            label="RG"
            value={formData.rg}
            onChange={(v) => updateField("rg", v)}
            placeholder="MG-00.000.000"
            required
          />
        </div>

        <TextField
          label="Endereço"
          value={formData.address}
          onChange={(v) => updateField("address", v)}
          placeholder="Rua, número, bairro, cidade"
          required
        />

        <SelectField
          label="Instituição de Ensino"
          value={formData.institution}
          onChange={(v) => updateField("institution", v)}
          options={mockInstitutions}
          placeholder="Selecione sua instituição"
          required
        />

        <SelectField
          label="Curso"
          value={formData.course}
          onChange={(v) => updateField("course", v)}
          options={mockCourses}
          placeholder="Selecione seu curso"
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

        <Button type="submit" fullWidth disabled={loading}>
          {loading ? "Criando conta..." : "Criar conta"}
        </Button>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted">
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
