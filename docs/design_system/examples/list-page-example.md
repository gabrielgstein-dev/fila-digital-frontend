# 📊 Exemplo: Página de Lista

## 📁 Baseado em: `/src/app/filas/page.tsx`

Este exemplo mostra como implementar uma página de listagem seguindo o design system.

## 🎯 Estrutura Completa

```tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Users, Clock, Sparkles, AlertCircle } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { 
  PageHeader,
  QueueSearchAndFilters,
  StatsCards,
  QueueCard,
  EmptyState,
  ErrorMessage
} from '@/components/ui'
import { useQueues } from '@/hooks/useQueues'
import { QueueType, NextAuthSession } from '@/types'

export default function FilasPage() {
  // Estados locais
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<QueueType | 'ALL'>('ALL')
  const router = useRouter()
  const { status } = useSession() as { data: NextAuthSession | null, status: string }
  
  // Hook customizado para lógica de negócio
  const {
    queues,
    isLoading,
    error,
    stats,
    deleteQueue,
    clearError
  } = useQueues()

  // Filtros locais
  const filteredQueues = queues.filter(queue => {
    const matchesSearch = queue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         queue.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'ALL' || queue.queueType === filterType
    return matchesSearch && matchesType
  })

  // Dados para stats cards
  const statsData = [
    {
      title: 'Total de Filas',
      value: stats.total,
      icon: Users,
      gradient: 'bg-gradient-to-br from-blue-500 to-indigo-600'
    },
    {
      title: 'Filas Ativas',
      value: stats.active,
      icon: Sparkles,
      gradient: 'bg-gradient-to-br from-green-500 to-emerald-600'
    },
    {
      title: 'Tempo Médio',
      value: `${stats.avgServiceTime} min`,
      icon: Clock,
      gradient: 'bg-gradient-to-br from-amber-500 to-orange-600'
    },
    {
      title: 'Capacidade Total',
      value: stats.totalCapacity,
      icon: AlertCircle,
      gradient: 'bg-gradient-to-br from-purple-500 to-pink-600'
    }
  ]

  // Handlers
  const handleViewQueue = (queueId: string) => {
    router.push(`/filas/${queueId}`)
  }

  const handleEditQueue = (queueId: string) => {
    router.push(`/filas/${queueId}/editar`)
  }

  const handleCreateQueue = () => {
    router.push('/filas/nova')
  }

  // Loading state - OBRIGATÓRIO
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Carregando..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 relative">
      {/* Background Elements - OBRIGATÓRIO */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/20 dark:bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content - OBRIGATÓRIO */}
      <div className="relative z-0 max-w-7xl mx-auto px-6 py-8">
        {/* Page Header - OBRIGATÓRIO */}
        <PageHeader
          icon={Users}
          title="Filas de Atendimento"
          description="Gerencie suas filas digitais inteligentes"
          action={{
            label: 'Nova Fila',
            onClick: handleCreateQueue,
            icon: Plus
          }}
        />

        {/* Search and Filters */}
        <QueueSearchAndFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterType={filterType}
          onFilterChange={setFilterType}
        />

        {/* Stats Cards */}
        <StatsCards stats={statsData} />

        {/* Error Message */}
        {error && (
          <ErrorMessage 
            message={error} 
            onDismiss={clearError}
          />
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text="Carregando filas..." />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredQueues.length === 0 && (
          <EmptyState
            icon={Users}
            title={searchTerm || filterType !== 'ALL' 
              ? 'Nenhuma fila encontrada' 
              : 'Nenhuma fila cadastrada'}
            description={searchTerm || filterType !== 'ALL'
              ? 'Tente ajustar os filtros de busca'
              : 'Comece criando sua primeira fila de atendimento'}
            action={!searchTerm && filterType === 'ALL' ? {
              label: 'Criar Primeira Fila',
              onClick: handleCreateQueue,
              icon: Plus
            } : undefined}
          />
        )}

        {/* Items Grid */}
        {!isLoading && filteredQueues.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQueues.map((queue) => (
              <QueueCard
                key={queue.id}
                queue={queue}
                onView={handleViewQueue}
                onEdit={handleEditQueue}
                onDelete={deleteQueue}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
```

## 🔑 Pontos Chave

### ✅ **Estrutura Obrigatória**
1. **Background gradient** + elementos decorativos
2. **Container principal** `max-w-7xl mx-auto px-6 py-8`
3. **PageHeader** com ícone, título e ação
4. **Estados de loading** adequados

### ✅ **Componentes Utilizados**
- `PageHeader` - Cabeçalho padronizado
- `QueueSearchAndFilters` - Busca e filtros específicos
- `StatsCards` - Métricas visuais
- `ErrorMessage` - Tratamento de erros
- `EmptyState` - Estado vazio
- `QueueCard` - Cards dos items

### ✅ **Hook Customizado**
- `useQueues` - Centraliza toda lógica de estado
- Retorna dados, loading, error, stats e funções

### ✅ **Padrões de Código**
- Estados locais para UI (search, filters)
- Handlers específicos para ações
- Filtros calculados localmente
- Verificação de autenticação

## 🎨 Resultado Visual

Esta implementação garante:
- ✅ Visual consistente com outras páginas
- ✅ Responsividade automática
- ✅ Modo escuro funcional
- ✅ Estados de loading/error/empty
- ✅ Interações padronizadas

## 🔄 Adaptação para Outras Entidades

Para adaptar para outras entidades (usuários, relatórios, etc.):

1. **Trocar hook**: `useQueues` → `useMinhaEntidade`
2. **Trocar componentes**: `QueueCard` → `MinhaEntidadeCard`
3. **Ajustar filtros**: Conforme necessário
4. **Manter estrutura**: Layout e padrões iguais

