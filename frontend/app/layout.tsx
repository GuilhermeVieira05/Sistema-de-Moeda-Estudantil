import type React from "react"
import { Poppins, Nunito } from "next/font/google"
import "./globals.css"
import { NotificationProvider } from "@/context/NotificationContext"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-primary",
})

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-mono",
})

export const metadata = {
  title: "Sistema de Mérito Estudantil",
  description: "Plataforma de reconhecimento estudantil com moeda virtual",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${poppins.variable} ${nunito.variable}`}>
      <body className="test-bg-gradient">
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </body>
    </html>
  )
}
