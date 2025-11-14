# 🚀 Templates Prontos para Novas Telas

## 📋 Templates Disponíveis
- [Página de Lista](#-template-página-de-lista)
- [Página de Formulário](#-template-página-de-formulário)
- [Página de Dashboard](#-template-página-de-dashboard)
- [Modal/Dialog](#-template-modal)

---

## 📊 Template: Página de Lista

```tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Users } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { 
  PageHeader,
  QueueSearchAndFilters,
  StatsCards,
  EmptyState,
  ErrorMessage
} from '@/components/ui'
import { NextAuthSession } from '@/types'

export default function MinhaListaPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('ALL')
  const router = useRouter()
  const { status } = useSession() as { data: NextAuthSession | null, status: string }
  
  // Estados
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filtrar items
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'ALL' || item.type === filterType
    return matchesSearch && matchesType
  })

  // Stats para os cards
  const statsData = [
    {
      title: 'Total de Items',
      value: items.length,
      icon: Users,
      gradient: 'bg-gradient-to-br from-blue-500 to-indigo-600'
    }
    // Adicionar mais stats conforme necessário
  ]

  // Handlers
  const handleCreate = () => router.push('/minha-rota/novo')
  const handleEdit = (id: string) => router.push(`/minha-rota/${id}/editar`)
  const handleView = (id: string) => router.push(`/minha-rota/${id}`)

  // Loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Carregando..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/20 dark:bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-0 max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <PageHeader
          icon={Users}
          title="Minha Lista"
          description="Gerencie seus items"
          action={{
            label: 'Novo Item',
            onClick: handleCreate,
            icon: Plus
          }}
        />

        {/* Search and Filters */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-6 mb-6">
          {/* Implementar filtros conforme necessário */}
        </div>

        {/* Stats Cards */}
        <StatsCards stats={statsData} />

        {/* Error Message */}
        {error && (
          <ErrorMessage 
            message={error} 
            onDismiss={() => setError(null)}
          />
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text="Carregando items..." />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredItems.length === 0 && (
          <EmptyState
            icon={Users}
            title="Nenhum item encontrado"
            description="Comece criando seu primeiro item"
            action={{
              label: 'Criar Primeiro Item',
              onClick: handleCreate,
              icon: Plus
            }}
          />
        )}

        {/* Items Grid */}
        {!isLoading && filteredItems.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-6">
                {/* Conteúdo do card do item */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
```

---

## 📝 Template: Página de Formulário

```tsx
'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { 
  Hash, 
  Users, 
  Save,
  ArrowLeft,
  Settings
} from 'lucide-react'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { 
  FormCard,
  FormField,
  FormSelect,
  FormTextarea,
  ErrorMessage
} from '@/components/ui'
import { NextAuthSession } from '@/types'

export default function MeuFormularioPage() {
  const router = useRouter()
  const { status } = useSession() as { data: NextAuthSession | null, status: string }
  
  // Estados do formulário
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Handlers
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Lógica de submit
  }

  const handleBack = () => router.push('/rota-anterior')

  // Loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Carregando..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/20 dark:bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-0 max-w-7xl mx-auto px-6 py-8">
        {/* Page Header com botão voltar */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBack}
              className="p-3 hover:bg-white/20 dark:hover:bg-slate-800/50 rounded-xl transition-colors backdrop-blur-sm"
            >
              <ArrowLeft className="w-6 h-6 text-slate-600 dark:text-slate-400" />
            </button>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                  Novo Item
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  Configure um novo item
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <FormCard
          title="Criar Novo Item"
          subtitle="Preencha as informações abaixo"
          badge={{
            label: 'Configuração',
            icon: Settings
          }}
        >
          {/* Success Message */}
          {success && (
            <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
              <p className="text-sm text-green-600 dark:text-green-400">
                Item criado com sucesso!
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <ErrorMessage 
              message={error} 
              onDismiss={() => setError(null)}
            />
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Campo Nome */}
              <FormField
                id="name"
                label="Nome"
                icon={Hash}
                placeholder="Digite o nome"
                required
              />

              {/* Campo Tipo */}
              <FormSelect
                id="type"
                label="Tipo"
                required
              >
                <option value="tipo1">Tipo 1</option>
                <option value="tipo2">Tipo 2</option>
              </FormSelect>
            </div>

            {/* Campo Descrição */}
            <FormTextarea
              id="description"
              label="Descrição"
              placeholder="Digite a descrição..."
              rows={4}
            />

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-3 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Salvar
                  </>
                )}
              </button>
            </div>
          </form>
        </FormCard>
      </div>
    </div>
  )
}
```

---

## 📊 Template: Página de Dashboard

```tsx
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { 
  Users, 
  TrendingUp, 
  Activity,
  BarChart3
} from 'lucide-react'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { 
  PageHeader,
  StatsCards,
  ErrorMessage
} from '@/components/ui'
import { NextAuthSession } from '@/types'

export default function MeuDashboardPage() {
  const { status } = useSession() as { data: NextAuthSession | null, status: string }
  
  // Estados
  const [metrics, setMetrics] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Carregar dados
  useEffect(() => {
    // Lógica para carregar métricas
  }, [])

  // Stats para os cards
  const statsData = [
    {
      title: 'Total de Usuários',
      value: metrics?.totalUsers || 0,
      icon: Users,
      gradient: 'bg-gradient-to-br from-blue-500 to-indigo-600'
    },
    {
      title: 'Crescimento',
      value: `+${metrics?.growth || 0}%`,
      icon: TrendingUp,
      gradient: 'bg-gradient-to-br from-green-500 to-emerald-600'
    },
    {
      title: 'Atividade',
      value: metrics?.activity || 0,
      icon: Activity,
      gradient: 'bg-gradient-to-br from-amber-500 to-orange-600'
    },
    {
      title: 'Performance',
      value: `${metrics?.performance || 0}%`,
      icon: BarChart3,
      gradient: 'bg-gradient-to-br from-purple-500 to-pink-600'
    }
  ]

  // Loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Carregando..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/20 dark:bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-0 max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <PageHeader
          icon={BarChart3}
          title="Dashboard"
          description="Visão geral dos seus dados"
        />

        {/* Error Message */}
        {error && (
          <ErrorMessage 
            message={error} 
            onDismiss={() => setError(null)}
          />
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text="Carregando dashboard..." />
          </div>
        )}

        {/* Stats Cards */}
        {!isLoading && (
          <StatsCards stats={statsData} />
        )}

        {/* Dashboard Content */}
        {!isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráficos e outros widgets */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Gráfico 1
              </h3>
              {/* Conteúdo do gráfico */}
            </div>

            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Gráfico 2
              </h3>
              {/* Conteúdo do gráfico */}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
```

---

## 🪟 Template: Modal/Dialog

```tsx
import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X, AlertTriangle } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className={`w-full ${sizeClasses[size]} transform overflow-hidden rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl p-6 text-left align-middle shadow-2xl border border-white/20 dark:border-slate-700/50 transition-all`}>
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title className="text-lg font-semibold text-slate-900 dark:text-white">
                    {title}
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>
                
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

// Modal de Confirmação
interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger'
}: ConfirmModalProps) {
  const variantStyles = {
    danger: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-amber-600 hover:bg-amber-700',
    info: 'bg-blue-600 hover:bg-blue-700'
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex items-start space-x-3 mb-6">
        <div className="flex-shrink-0">
          <AlertTriangle className="w-6 h-6 text-amber-500" />
        </div>
        <p className="text-slate-600 dark:text-slate-400">
          {message}
        </p>
      </div>

      <div className="flex items-center justify-end space-x-3">
        <button
          onClick={onClose}
          className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium rounded-lg transition-colors"
        >
          {cancelText}
        </button>
        <button
          onClick={onConfirm}
          className={`px-4 py-2 text-white font-semibold rounded-lg transition-colors ${variantStyles[variant]}`}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  )
}
```

---

## 🎯 Como Usar os Templates

### 1. **Copiar Template Base**
Escolha o template mais adequado para sua tela

### 2. **Personalizar Conteúdo**
- Altere ícones, títulos e descrições
- Ajuste campos de formulário conforme necessário
- Modifique handlers e lógica de negócio

### 3. **Adicionar Funcionalidades**
- Integre hooks customizados
- Adicione validações específicas
- Implemente chamadas de API

### 4. **Testar e Ajustar**
- Verifique responsividade
- Teste modo escuro
- Valide acessibilidade

---

**💡 Dica: Sempre consulte as páginas existentes como `/filas` e `/filas/nova` para referência!**
