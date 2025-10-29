"use client"
import AuthLayout from "@/components/auth-layout"
import RegisterForm from "@/components/register-form"

export default function StudentRegisterPage() {
  return (
    <AuthLayout title="Cadastro de Aluno" subtitle="Preencha seus dados para criar sua conta">
      <RegisterForm type="aluno" />
    </AuthLayout>
  )
}
