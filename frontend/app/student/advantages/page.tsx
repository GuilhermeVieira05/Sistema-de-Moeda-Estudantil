"use client"

import { useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import AdvantageCard from "@/components/advantage-card"
import type { Advantage } from "@/types"

const mockStudent = {
  name: "João Silva",
  balance: 850,
}

const mockAdvantages: Advantage[] = [
  {
    id: "1",
    companyId: "1",
    companyName: "Restaurante Universitário",
    title: "20% de desconto no RU",
    description: "Válido para almoço e jantar durante todo o mês",
    cost: 200,
    imageUrl: "/restaurant-food-variety.png",
  },
  {
    id: "2",
    companyId: "2",
    companyName: "Livraria Acadêmica",
    title: "R$ 50 em livros",
    description: "Vale-compra para qualquer livro da loja",
    cost: 500,
    imageUrl: "/bookstore-books.jpg",
  },
  {
    id: "3",
    companyId: "3",
    companyName: "Tech Store",
    title: "15% em acessórios tech",
    description: "Desconto em mouses, teclados, fones e mais",
    cost: 300,
    imageUrl: "/tech-accessories.png",
  },
  {
    id: "4",
    companyId: "4",
    companyName: "Café Central",
    title: "Café grátis por uma semana",
    description: "Um café expresso por dia durante 7 dias",
    cost: 150,
    imageUrl: "/cozy-corner-cafe.png",
  },
  {
    id: "5",
    companyId: "5",
    companyName: "Academia Fitness",
    title: "1 mês de academia",
    description: "Acesso completo à academia por 30 dias",
    cost: 800,
    imageUrl: "/gym-fitness.jpg",
  },
  {
    id: "6",
    companyId: "6",
    companyName: "Cinema Plus",
    title: "2 ingressos de cinema",
    description: "Válido para qualquer sessão, exceto estreias",
    cost: 400,
    imageUrl: "/classic-movie-theater.png",
  },
]

export default function StudentAdvantagesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const filteredAdvantages = mockAdvantages.filter((advantage) => {
    const matchesSearch =
      advantage.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      advantage.companyName.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const handleRedeem = (advantage: Advantage) => {
    if (mockStudent.balance >= advantage.cost) {
      alert(`Resgatando: ${advantage.title}\n\nUm email com o cupom será enviado para você!`)
    }
  }

  return (
    <DashboardLayout userType="student" userName={mockStudent.name} balance={mockStudent.balance}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Vantagens Disponíveis</h1>
          <p className="text-muted">Resgate vantagens incríveis com suas moedas</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl p-6 border border-border">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Buscar vantagens..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
            >
              <option value="all">Todas as categorias</option>
              <option value="food">Alimentação</option>
              <option value="education">Educação</option>
              <option value="tech">Tecnologia</option>
              <option value="entertainment">Entretenimento</option>
            </select>
          </div>
        </div>

        {/* Advantages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAdvantages.map((advantage) => (
            <AdvantageCard
              key={advantage.id}
              advantage={advantage}
              onRedeem={handleRedeem}
              userBalance={mockStudent.balance}
            />
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
