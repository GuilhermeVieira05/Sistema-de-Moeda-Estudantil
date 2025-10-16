"use client"

import type { Advantage } from "@/types"
import Button from "./button"

interface AdvantageCardProps {
  advantage: Advantage
  onRedeem?: (advantage: Advantage) => void
  userBalance?: number
}

export default function AdvantageCard({ advantage, onRedeem, userBalance }: AdvantageCardProps) {
  const canAfford = userBalance !== undefined && userBalance >= advantage.cost

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      <div className="aspect-video bg-gray-100 relative overflow-hidden">
        <img
          src={advantage.imageUrl || "/placeholder.svg"}
          alt={advantage.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1.5 shadow-lg">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
              clipRule="evenodd"
            />
          </svg>
          {advantage.cost}
        </div>
      </div>

      <div className="p-6">
        <div className="mb-4">
          <h3 className="font-bold text-xl text-gray-900 mb-2 truncate">{advantage.title}</h3>
          <p className="text-sm font-medium text-blue-600 truncate">{advantage.companyName}</p>
        </div>

        <p className="text-sm text-gray-600 mb-6 line-clamp-2 min-h-[2.5rem]">{advantage.description}</p>

        {onRedeem && (
          <Button
            onClick={() => onRedeem(advantage)}
            fullWidth
            disabled={!canAfford}
            variant={canAfford ? "primary" : "outline"}
            className="text-white"
          >
            {canAfford ? "Resgatar Vantagem" : "Saldo Insuficiente"}
          </Button>
        )}
      </div>
    </div>
  )
}
