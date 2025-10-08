"use client"

import type React from "react"
import { useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import TextField from "@/components/text-field"
import Button from "@/components/button"
import { useRouter } from "next/navigation"

const mockCompany = {
  name: "Tech Store",
  email: "contato@techstore.com",
}

export default function NewAdvantagePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    cost: "",
    imageUrl: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulação de cadastro
    setTimeout(() => {
      alert(`Vantagem cadastrada com sucesso!\n\nTítulo: ${formData.title}\nCusto: ${formData.cost} moedas`)
      router.push("/company/advantages")
    }, 1000)
  }

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <DashboardLayout userType="company" userName={mockCompany.name}>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Nova Vantagem</h1>
          <p className="text-muted">Cadastre uma nova vantagem para os estudantes</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 border border-border space-y-6">
          <TextField
            label="Título da vantagem"
            value={formData.title}
            onChange={(v) => updateField("title", v)}
            placeholder="Ex: 20% de desconto em produtos"
            required
          />

          <TextField
            label="Descrição"
            value={formData.description}
            onChange={(v) => updateField("description", v)}
            placeholder="Descreva os detalhes da vantagem..."
            multiline
            rows={4}
            required
          />

          <TextField
            label="Custo em moedas"
            type="number"
            value={formData.cost}
            onChange={(v) => updateField("cost", v)}
            placeholder="Ex: 300"
            required
          />

          <TextField
            label="URL da imagem"
            value={formData.imageUrl}
            onChange={(v) => updateField("imageUrl", v)}
            placeholder="https://exemplo.com/imagem.jpg"
            required
          />

          {formData.imageUrl && (
            <div className="border border-border rounded-lg overflow-hidden">
              <img src={formData.imageUrl || "/placeholder.svg"} alt="Preview" className="w-full h-48 object-cover" />
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <svg
                className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p className="text-sm text-blue-800">
                  Quando um aluno resgatar esta vantagem, você receberá um email com o código de confirmação e os dados
                  do aluno.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={() => router.push("/company/advantages")} fullWidth>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} fullWidth>
              {loading ? "Cadastrando..." : "Cadastrar Vantagem"}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
