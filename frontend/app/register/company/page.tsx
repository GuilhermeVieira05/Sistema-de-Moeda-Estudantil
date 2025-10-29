"use client"
import AuthLayout from "@/components/auth-layout"
import RegisterForm from "@/components/register-form"

export default function CompanyRegisterPage() {
  return (
    <AuthLayout title="Cadastro de Empresa" subtitle="Torne-se um parceiro e ofereça vantagens aos estudantes">
      <RegisterForm type="empresa" />
    </AuthLayout>
  )
}
