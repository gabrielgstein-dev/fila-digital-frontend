# 📝 Exemplo: Página de Formulário

## 📁 Baseado em: `/src/app/filas/nova/page.tsx`

Este exemplo mostra como implementar uma página de formulário seguindo o design system.

## 🎯 Estrutura Completa

```tsx
'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { 
  Hash, 
  Users, 
  Save,
  ArrowLeft,
  Settings,
  Clock,
  AlertCircle
} from 'lucide-react'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { 
  FormCard,
  FormField,
  FormSelect,
  FormTextarea,
  ErrorMessage
} from '@/components/ui'
import { useQueueForm } from '@/hooks/useQueueForm'
import { NextAuthSession } from '@/types'

export default function NovaFilaPage() {
  const router = useRouter()
  const { status } = useSession() as { data: NextAuthSession | null, status: string }
  
  // Hook customizado para lógica do formulário
  const {
    register,
    formState: { errors },
    isLoading,
    error,
    success,
    onSubmit,
    handleBack,
    clearError
  } = useQueueForm()

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
        {/* Page Header com botão voltar - PADRÃO para formulários */}
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
                  Nova Fila
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  Configure uma nova fila de atendimento
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Card - Container principal do formulário */}
        <FormCard
          title="Criar Nova Fila"
          subtitle="Preencha as informações da fila de atendimento"
          badge={{
            label: 'Configuração',
            icon: Settings
          }}
        >
          {/* Success Message - Mostrar quando sucesso */}
          {success && (
            <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
              <p className="text-sm text-green-600 dark:text-green-400">
                ✅ Fila criada com sucesso! Redirecionando...
              </p>
            </div>
          )}

          {/* Error Message - Mostrar quando erro */}
          {error && (
            <ErrorMessage 
              message={error} 
              onDismiss={clearError}
            />
          )}

          {/* Formulário Principal */}
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Grid de Campos - 2 colunas em desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Campo Nome - Obrigatório */}
              <FormField
                {...register('name')}
                id="name"
                label="Nome da Fila"
                icon={Hash}
                placeholder="Ex: Atendimento Geral"
                error={errors.name}
                helperText="Nome único para identificar a fila"
                required
              />

              {/* Campo Tipo - Select */}
              <FormSelect
                {...register('queueType')}
                id="queueType"
                label="Tipo de Fila"
                error={errors.queueType}
                required
              >
                <option value="">Selecione um tipo</option>
                <option value="GENERAL">🔵 Geral</option>
                <option value="PRIORITY">🟡 Prioritária</option>
                <option value="VIP">🟣 VIP</option>
              </FormSelect>
            </div>

            {/* Segunda linha de campos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Campo Capacidade */}
              <FormField
                {...register('capacity', { valueAsNumber: true })}
                id="capacity"
                type="number"
                label="Capacidade Máxima"
                icon={Users}
                placeholder="Ex: 50"
                error={errors.capacity}
                helperText="Número máximo de pessoas na fila"
                min="1"
                required
              />

              {/* Campo Tempo Estimado */}
              <FormField
                {...register('estimatedServiceTime', { valueAsNumber: true })}
                id="estimatedServiceTime"
                type="number"
                label="Tempo de Atendimento (min)"
                icon={Clock}
                placeholder="Ex: 15"
                error={errors.estimatedServiceTime}
                helperText="Tempo médio de atendimento em minutos"
                min="1"
              />
            </div>

            {/* Campo Descrição - Largura completa */}
            <FormTextarea
              {...register('description')}
              id="description"
              label="Descrição"
              placeholder="Descreva o propósito desta fila..."
              rows={4}
              error={errors.description}
              helperText="Informações adicionais sobre a fila (opcional)"
            />

            {/* Seção de Configurações Avançadas */}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Configurações Avançadas
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Campo Prioridade */}
                <FormSelect
                  {...register('priority')}
                  id="priority"
                  label="Nível de Prioridade"
                >
                  <option value="LOW">🟢 Baixa</option>
                  <option value="MEDIUM">🟡 Média</option>
                  <option value="HIGH">🔴 Alta</option>
                </FormSelect>

                {/* Campo Status Inicial */}
                <FormSelect
                  {...register('isActive')}
                  id="isActive"
                  label="Status Inicial"
                >
                  <option value="true">✅ Ativa</option>
                  <option value="false">⏸️ Inativa</option>
                </FormSelect>
              </div>
            </div>

            {/* Botões de Ação - SEMPRE no final */}
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
                    Criando...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Criar Fila
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

## 🔑 Pontos Chave

### ✅ **Estrutura Obrigatória**
1. **Layout base** com background e elementos decorativos
2. **Header com botão voltar** para navegação
3. **FormCard** como container principal
4. **Estados de success/error** bem definidos

### ✅ **Organização do Formulário**
- **Grid responsivo** (1 coluna mobile, 2 desktop)
- **Campos agrupados** logicamente
- **Seções separadas** por border-top
- **Botões de ação** sempre no final

### ✅ **Componentes Utilizados**
- `FormCard` - Container do formulário
- `FormField` - Campos de input
- `FormSelect` - Dropdowns
- `FormTextarea` - Campos de texto longo
- `ErrorMessage` - Tratamento de erros

### ✅ **Hook Customizado**
- `useQueueForm` - Centraliza toda lógica
- Gerencia validação, estados, submit
- Integra com react-hook-form + zod

### ✅ **Estados Visuais**
- Loading no botão durante submit
- Success message após criação
- Error message para problemas
- Validação visual dos campos

## 🎨 Resultado Visual

Esta implementação garante:
- ✅ Visual glassmorphism consistente
- ✅ Responsividade automática
- ✅ Modo escuro funcional
- ✅ Validação visual clara
- ✅ Feedback de estados

## 🔄 Adaptação para Outras Entidades

Para adaptar para outras entidades:

1. **Trocar hook**: `useQueueForm` → `useMinhaEntidadeForm`
2. **Ajustar campos**: Conforme necessário para entidade
3. **Manter estrutura**: Layout e padrões iguais
4. **Atualizar validação**: Schema zod específico

## 📋 Validação com Zod (Exemplo)

```tsx
const queueSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  queueType: z.enum(['GENERAL', 'PRIORITY', 'VIP']),
  capacity: z.number().min(1, 'Capacidade deve ser maior que 0'),
  estimatedServiceTime: z.number().min(1, 'Tempo deve ser maior que 0'),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
  isActive: z.boolean().default(true)
})
```

