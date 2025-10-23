"use client"

import { useEffect, useState } from "react"
import { getAlunoData, updateAlunoData, deleteAluno } from "@/api/alunoApi"
import type { Student } from "@/types"
import DashboardLayout from "@/components/dashboard-layout"
import LoadingSpinner from "@/components/loading-spinner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"



export default function StudentProfile() {
    const [aluno, setAluno] = useState<Student | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [isSaving, setIsSaving] = useState<boolean>(false)
    const [isDeleting, setIsDeleting] = useState<boolean>(false)
    const [formData, setFormData] = useState<Partial<Student>>({})

    useEffect(() => {
        fetchAluno()
    }, [])

    const fetchAluno = async () => {
        setIsLoading(true)
        try {
            const alunoBuscado = await getAlunoData()
            if (alunoBuscado) {
                setAluno(alunoBuscado)
                setFormData(alunoBuscado)
                console.log("Dados do aluno carregados com sucesso:", alunoBuscado)
            } else {
                console.error("Não foi possível carregar os dados do perfil.")
            }
        } catch (err) {
            console.error("Ocorreu um erro ao carregar os dados:", err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleEdit = () => {
        setIsEditing(true)
    }

    const handleCancel = () => {
        setIsEditing(false)
        setFormData(aluno || {})
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const success = await updateAlunoData(formData)
            if (success) {
                setAluno({ ...aluno, ...formData } as Student)
                setIsEditing(false)
                console.log("Perfil atualizado com sucesso!")
            } else {
                console.error("Não foi possível atualizar o perfil.")
            }
        } catch (err) {
            console.error("Ocorreu um erro ao atualizar o perfil:", err)
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            const success = await deleteAluno()
            if (success) {
                console.log("Conta excluída com sucesso.")
                // Redireciona para a página inicial
                setTimeout(() => {
                    window.location.href = "/"
                }, 2000)
            } else {
                console.error("Não foi possível excluir a conta.")
            }
        } catch (err) {
            console.error("Ocorreu um erro ao excluir a conta:", err)
        } finally {
            setIsDeleting(false)
        }
    }

    const handleInputChange = (field: keyof Student, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleName = (name: string) => {
        const splitName = name.split(" ")
        if (splitName.length > 1) {
            return splitName[0] + " " + splitName.at(-1)
        }
        return splitName[0]
    }

    if (isLoading) {
        return <LoadingSpinner />
    }

    if (!aluno) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>Erro</CardTitle>
                        <CardDescription>Não foi possível carregar os dados do perfil.</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        )
    }

    return (
        <DashboardLayout userType="student" userName={handleName(aluno.nome)} balance={aluno.saldo_moedas}>
            <div className="space-y-8">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white shadow-xl">
                    <h1 className="text-4xl font-bold mb-3">Meu Perfil</h1>
                    <p className="text-blue-100 text-lg">Gerencie suas informações pessoais e configurações</p>
                </div>

                {/* Profile Information Card */}
                <Card className="shadow-lg border-gray-200">
                    <CardHeader className="border-b border-gray-200 bg-gray-50">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-2xl mt-5">Informações Pessoais</CardTitle>
                                <CardDescription className="mt-1">Visualize e edite seus dados cadastrais</CardDescription>
                            </div>
                            {!isEditing && (
                                <Button onClick={handleEdit} className="bg-blue-600 hover:bg-blue-700 text-white">
                                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                        />
                                    </svg>
                                    Editar
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="pt-5 pb-5">
                        {isEditing ? (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="nome">Nome Completo</Label>
                                        <Input
                                            id="nome"
                                            value={formData.nome || ""}
                                            onChange={(e) => handleInputChange("nome", e.target.value)}
                                            placeholder="Digite seu nome completo"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">E-mail</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={formData.email || ""}
                                            onChange={(e) => handleInputChange("email", e.target.value)}
                                            placeholder="seu.email@exemplo.com"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="cpf">CPF</Label>
                                        <Input
                                            id="cpf"
                                            value={formData.cpf || ""}
                                            onChange={(e) => handleInputChange("cpf", e.target.value)}
                                            placeholder="000.000.000-00"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="rg">RG</Label>
                                        <Input
                                            id="rg"
                                            value={formData.rg || ""}
                                            onChange={(e) => handleInputChange("rg", e.target.value)}
                                            placeholder="00.000.000-0"
                                        />
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="endereco">Endereço</Label>
                                        <Input
                                            id="endereco"
                                            value={formData.endereco || ""}
                                            onChange={(e) => handleInputChange("endereco", e.target.value)}
                                            placeholder="Rua, número - Cidade, Estado"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="instituicao">Instituição de Ensino</Label>
                                        <Input
                                            id="instituicao"
                                            value={formData.instituicao_ensino?.nome || ""}
                                            onChange={(e) => handleInputChange("instituicao_ensino", e.target.value)}
                                            placeholder="Nome da universidade"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="curso">Curso</Label>
                                        <Input
                                            id="curso"
                                            value={formData.curso || ""}
                                            onChange={(e) => handleInputChange("curso", e.target.value)}
                                            placeholder="Nome do curso"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4 border-t border-gray-200">
                                    <Button onClick={handleSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white">
                                        {isSaving ? "Salvando..." : "Salvar Alterações"}
                                    </Button>
                                    <Button onClick={handleCancel} variant="outline" disabled={isSaving}>
                                        Cancelar
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 mb-1">Nome Completo</p>
                                        <p className="text-base text-gray-900 font-medium">{aluno.nome}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium text-gray-500 mb-1">E-mail</p>
                                        <p className="text-base text-gray-900">{aluno.email || "Não informado"}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium text-gray-500 mb-1">CPF</p>
                                        <p className="text-base text-gray-900">{aluno.cpf || "Não informado"}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium text-gray-500 mb-1">RG</p>
                                        <p className="text-base text-gray-900">{aluno.rg || "Não informado"}</p>
                                    </div>

                                    <div className="md:col-span-2">
                                        <p className="text-sm font-medium text-gray-500 mb-1">Endereço</p>
                                        <p className="text-base text-gray-900">{aluno.endereco || "Não informado"}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium text-gray-500 mb-1">Instituição de Ensino</p>
                                        <p className="text-base text-gray-900">{aluno.instituicao_ensino.nome || "Não informado"}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium text-gray-500 mb-1">Curso</p>
                                        <p className="text-base text-gray-900">{aluno.curso || "Não informado"}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium text-gray-500 mb-1">Saldo de Moedas</p>
                                        <div className="flex items-center gap-2">
                                            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            <p className="text-2xl font-bold text-blue-600">{aluno.saldo_moedas}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Danger Zone */}
                <Card className="shadow-lg border-red-200">
                    <CardHeader className="border-b border-red-200 bg-red-50">
                        <CardTitle className="text-2xl text-red-700 mt-5">Zona de Perigo</CardTitle>
                        <CardDescription className="text-red-600">
                            Ações irreversíveis que afetam permanentemente sua conta
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-5 pb-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">Excluir Conta</h3>
                                <p className="text-sm text-gray-600">
                                    Uma vez excluída, sua conta não poderá ser recuperada. Todos os seus dados serão permanentemente
                                    removidos.
                                </p>
                            </div>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" disabled={isDeleting}>
                                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                            />
                                        </svg>
                                        Excluir Conta
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Esta ação não pode ser desfeita. Isso excluirá permanentemente sua conta e removerá todos os seus
                                            dados de nossos servidores.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={handleDelete}
                                            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                                        >
                                            {isDeleting ? "Excluindo..." : "Sim, excluir minha conta"}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}
