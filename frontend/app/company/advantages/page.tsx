"use client"

import { useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import AdvantageCard from "@/components/advantage-card"
import Button from "@/components/button"
import { useRouter } from "next/navigation"
import type { Advantage } from "@/types"

const mockCompany = {
  name: "Tech Store",
  email: "contato@techstore.com",
}

const mockAdvantages: Advantage[] = [
  {
    id: "1",
    companyId: "1",
    companyName: "Tech Store",
    title: "15% em acessórios tech",
    description: "Desconto em mouses, teclados, fones e mais",
    cost: 300,
    imageUrl: "/tech-accessories.png",
  },
  {
    id: "2",
    companyId: "1",
    companyName: "Tech Store",
    title: "R$ 100 em produtos",
    description: "Vale-compra para qualquer produto da loja",
    cost: 800,
    imageUrl: "/tech-store-products.jpg",
  },
  {
    id: "3",
    companyId: "1",
    companyName: "Tech Store",
    title: "Mouse Gamer",
    description: "Mouse gamer RGB com 7 botões programáveis",
    cost: 600,
    imageUrl: "/gaming-mouse.png",
  },
  {
    id: "4",
    companyId: "1",
    companyName: "Tech Store",
    title: "Fone Bluetooth",
    description: "Fone de ouvido sem fio com cancelamento de ruído",
    cost: 700,
    imageUrl: "/bluetooth-headphones.jpg",
  },
]

export default function CompanyAdvantagesPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredAdvantages = mockAdvantages.filter((advantage) =>
    advantage.title.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEdit = (advantage: Advantage) => {
    alert(`Editar vantagem: ${advantage.title}`)
  }

  const handleDelete = (advantage: Advantage) => {
    if (confirm(`Tem certeza que deseja excluir "${advantage.title}"?`)) {
      alert("Vantagem excluída!")
    }
  }

  return (
    <DashboardLayout userType="company" userName={mockCompany.name}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Minhas Vantagens</h1>
            <p className="text-muted">Gerencie as vantagens oferecidas aos estudantes</p>
          </div>

          <Button onClick={() => router.push("/company/advantages/new")}>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nova Vantagem
            </div>
          </Button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl p-6 border border-border">
          <input
            type="text"
            placeholder="Buscar vantagens..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Advantages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAdvantages.map((advantage) => (
            <div key={advantage.id} className="relative group">
              <AdvantageCard advantage={advantage} />

              <div className="absolute top-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(advantage)}
                  className="p-2 bg-white rounded-lg shadow-lg hover:bg-surface transition-colors"
                  title="Editar"
                >
                  <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>

                <button
                  onClick={() => handleDelete(advantage)}
                  className="p-2 bg-white rounded-lg shadow-lg hover:bg-surface transition-colors"
                  title="Excluir"
                >
                  <svg className="w-4 h-4 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredAdvantages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted">Nenhuma vantagem encontrada</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
