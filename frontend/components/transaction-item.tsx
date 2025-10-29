import type { Transaction } from "@/types"

interface TransactionItemProps {
  transaction: Transaction
}

export default function TransactionItem({ transaction }: TransactionItemProps) {
  const isPositive = transaction.type === "receive"
  const isNegative = transaction.type === "redeem"

  return (
    <div className="flex items-center justify-between p-4 hover:bg-surface rounded-lg transition-colors">
      <div className="flex items-center gap-4">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isPositive ? "bg-success/10" : isNegative ? "bg-error/10" : "bg-primary/10"
          }`}
        >
          {isPositive ? (
            <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          ) : isNegative ? (
            <svg className="w-5 h-5 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
          )}
        </div>

        <div>
          <p className="font-medium text-foreground">{transaction.description}</p>
          <p className="text-sm text-gray-500">{transaction.date}</p>
          {transaction.from && <p className="text-xs text-blue-600">De: {transaction.from}</p>}
          {transaction.to && <p className="text-xs text-blue-600">Para: {transaction.to}</p>}
        </div>
      </div>

      <div className={`font-bold ${isPositive ? "text-success" : isNegative ? "text-error" : "text-foreground"}`}>
        {isPositive ? "+" : isNegative ? "-" : ""}
        {transaction.amount}
      </div>
    </div>
  )
}
