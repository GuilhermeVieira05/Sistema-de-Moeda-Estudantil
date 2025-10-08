"use client"

import DashboardLayout from "@/components/dashboard-layout"
import StatCard from "@/components/stat-card"
import AdvantageCard from "@/components/advantage-card"
import RedemptionItem from "@/components/redemption-item"
import Button from "@/components/button"
import { useRouter } from "next/navigation"
import type { Advantage, Redemption } from "@/types"

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
]

const mockRecentRedemptions: Redemption[] = [
  {
    id: "1",
    advantageId: "1",
    advantageTitle: "15% em acessórios tech",
    studentName: "João Silva",
    studentEmail: "joao@email.com",
    date: "05/01/2025",
    code: "TECH-A1B2C3",
    status: "pending",
  },
  {
    id: "2",
    advantageId: "2",
    advantageTitle: "R$ 100 em produtos",
    studentName: "Maria Santos",
    studentEmail: "maria@email.com",
    date: "03/01/2025",
    code: "TECH-D4E5F6",
    status: "completed",
  },
]

export default function CompanyDashboard() {
  const router = useRouter()

  const handleCompleteRedemption = (redemption: Redemption) => {
    alert(`Resgate confirmado!\n\nCódigo: ${redemption.code}\nAluno: ${redemption.studentName}`)
  }

  return (
    <DashboardLayout userType="company" userName={mockCompany.name}>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Bem-vindo, {mockCompany.name}!</h1>
          <p className="text-muted">Gerencie suas vantagens e acompanhe os resgates</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Vantagens Ativas"
            value={mockAdvantages.length}
            icon={
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                />
              </svg>
            }
          />

          <StatCard
            title="Total de Resgates"
            value={127}
            icon={
              <svg className="w-6 h-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
            trend={{ value: "+12 este mês", positive: true }}
          />

          <StatCard
            title="Resgates Pendentes"
            value={3}
            icon={
              <svg className="w-6 h-6 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
          />
        </div>

        {/* Quick Action */}
        <div className="bg-gradient-to-br from-secondary to-primary rounded-2xl p-8 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">Cadastre novas vantagens</h2>
              <p className="text-white/90">Atraia mais estudantes oferecendo benefícios exclusivos</p>
            </div>
            <Button variant="secondary" onClick={() => router.push("/company/advantages/new")}>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Nova Vantagem
              </div>
            </Button>
          </div>
        </div>

        {/* My Advantages */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Minhas Vantagens</h2>
            <a href="/company/advantages" className="text-primary font-medium hover:underline">
              Ver todas
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockAdvantages.map((advantage) => (
              <AdvantageCard key={advantage.id} advantage={advantage} />
            ))}
          </div>
        </div>

        {/* Recent Redemptions */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Resgates Recentes</h2>
            <a href="/company/redemptions" className="text-primary font-medium hover:underline">
              Ver todos
            </a>
          </div>

          <div className="bg-white rounded-xl border border-border divide-y divide-border">
            {mockRecentRedemptions.map((redemption) => (
              <RedemptionItem key={redemption.id} redemption={redemption} onComplete={handleCompleteRedemption} />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
