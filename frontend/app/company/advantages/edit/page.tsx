"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import TextField from "@/components/text-field"
import Button from "@/components/button"
import { useRouter, useSearchParams } from "next/navigation"

export default function EditAdvantagePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get("id") // ID vem como string

  const [loading, setLoading] = useState(false)
  const [company, setCompany] = useState<any>(null)
  const [loadingData, setLoadingData] = useState(true)

  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    custo_moedas: "",
    foto_url: "",
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) {
          setLoadingData(false)
          return
        }

        const token = localStorage.getItem("token")
        if (!token) {
          alert("Token não encontrado. Faça login novamente.")
          router.push("/login")
          return
        }

        // Buscar perfil da empresa
        const perfilRes = await fetch("http://localhost:8080/api/empresa/perfil", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!perfilRes.ok) throw new Error("Erro ao buscar perfil")
        const perfilData = await perfilRes.json()
        setCompany(perfilData)

        // Buscar vantagem
        const vantRes = await fetch(`http://localhost:8080/api/empresa/vantagens/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!vantRes.ok) throw new Error("Erro ao buscar vantagem")
        const vant = await vantRes.json()

        // Ajustar para o padrão do formulário
        setFormData({
          titulo: vant.titulo ?? "",
          descricao: vant.descricao ?? "",
          custo_moedas: String(vant.custoMoedas ?? vant.custo_moedas ?? ""),
          foto_url: vant.fotoURL ?? vant.foto_url ?? "",
        })
      } catch (err) {
        console.error("❌ Erro ao carregar dados:", err)
        alert("Erro ao carregar dados da vantagem.")
      } finally {
        setLoadingData(false)
      }
    }

    fetchData()
  }, [id, router])

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        alert("Token não encontrado. Faça login novamente.")
        router.push("/login")
        return
      }

      const payload = {
        titulo: formData.titulo,
        descricao: formData.descricao,
        foto_url: formData.foto_url,
        custo_moedas: parseInt(formData.custo_moedas),
      }

      const response = await fetch(`http://localhost:8080/api/empresa/vantagens/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "Erro ao atualizar vantagem")

      alert("✅ Vantagem atualizada com sucesso!")
      router.push("/company/advantages")
    } catch (err) {
      console.error("❌ Erro ao atualizar:", err)
      alert("Erro ao atualizar vantagem.")
    } finally {
      setLoading(false)
    }
  }

  if (loadingData || !company) {
    return (
      <DashboardLayout userType="company" userName="Carregando...">
        <div className="text-center mt-20 text-gray-500">
          Carregando informações...
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userType="company" userName={company.nome || "Empresa"}>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Editar Vantagem</h1>
          <p className="text-muted">Atualize os dados da vantagem</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl p-8 border border-border space-y-6"
        >
          <TextField
            label="Título da vantagem"
            value={formData.titulo}
            onChange={(v) => updateField("titulo", v)}
            required
          />

          <TextField
            label="Descrição"
            value={formData.descricao}
            onChange={(v) => updateField("descricao", v)}
            multiline
            rows={4}
            required
          />

          <TextField
            label="Custo em moedas"
            type="number"
            value={formData.custo_moedas}
            onChange={(v) => updateField("custo_moedas", v)}
            required
          />

          <TextField
            label="URL da imagem"
            value={formData.foto_url}
            onChange={(v) => updateField("foto_url", v)}
            required
          />

          {formData.foto_url && (
            <div className="border border-border rounded-lg overflow-hidden">
              <img
                src={formData.foto_url}
                alt="Preview"
                className="w-full h-48 object-cover"
              />
            </div>
          )}

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/company/advantages")}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
