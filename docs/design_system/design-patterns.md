# 🎨 Design System & Padrões de Desenvolvimento

## 📋 Índice
- [Estrutura Base de Páginas](#estrutura-base-de-páginas)
- [Componentes Reutilizáveis](#componentes-reutilizáveis)
- [Padrões de Layout](#padrões-de-layout)
- [Sistema de Cores](#sistema-de-cores)
- [Tipografia](#tipografia)
- [Espaçamentos](#espaçamentos)
- [Estados e Interações](#estados-e-interações)
- [Hooks Customizados](#hooks-customizados)
- [Boas Práticas](#boas-práticas)

---

## 🏗️ Estrutura Base de Páginas

### Template Básico de Página
```tsx
'use client'

import { useSession } from 'next-auth/react'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { PageHeader, ErrorMessage } from '@/components/ui'
import { NextAuthSession } from '@/types'

export default function MinhaNovaPage() {
  const { status } = useSession() as { data: NextAuthSession | null, status: string }

  // Estados de carregamento
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

      {/* Main Content - SEMPRE usar esta estrutura */}
      <div className="relative z-0 max-w-7xl mx-auto px-6 py-8">
        <PageHeader
          icon={MeuIcone}
          title="Título da Página"
          description="Descrição da página"
          action={{
            label: 'Nova Ação',
            onClick: handleAction,
            icon: Plus
          }}
        />
        
        {/* Conteúdo da página aqui */}
      </div>
    </div>
  )
}
```

### ⚠️ **OBRIGATÓRIO em toda página:**
- ✅ Background gradient padrão
- ✅ Elementos de background (círculos blur)
- ✅ Container `max-w-7xl mx-auto px-6 py-8`
- ✅ Z-index `z-0` para conteúdo principal
- ✅ Estados de loading consistentes

---

## 🧩 Componentes Reutilizáveis

### 📦 Importação Centralizada
```tsx
import {
  PageHeader,
  SearchAndFilters,
  QueueSearchAndFilters,
  StatsCards,
  QueueCard,
  EmptyState,
  ErrorMessage,
  FormCard,
  FormField,
  FormSelect,
  FormTextarea
} from '@/components/ui'
```

### 🔧 Componentes Disponíveis

#### **1. PageHeader** - Cabeçalho de Página
```tsx
<PageHeader
  icon={Users}                    // Ícone obrigatório
  title="Título da Página"        // Título obrigatório
  description="Descrição"         // Opcional
  action={{                       // Botão de ação opcional
    label: 'Nova Ação',
    onClick: handleAction,
    icon: Plus
  }}
/>
```

#### **2. FormCard** - Container de Formulários
```tsx
<FormCard
  title="Título do Formulário"
  subtitle="Subtítulo explicativo"
  badge={{
    label: 'Status Badge',
    icon: Settings
  }}
>
  {/* Conteúdo do formulário */}
</FormCard>
```

#### **3. FormField** - Campos de Input
```tsx
<FormField
  {...register('fieldName')}
  id="fieldName"
  label="Nome do Campo"
  icon={Hash}                     // Ícone opcional
  placeholder="Placeholder"
  error={errors.fieldName}
  helperText="Texto de ajuda"     // Opcional
  required                        // Opcional
/>
```

#### **4. StatsCards** - Cards de Estatísticas
```tsx
const statsData = [
  {
    title: 'Total',
    value: 42,
    icon: Users,
    gradient: 'bg-gradient-to-br from-blue-500 to-indigo-600'
  }
]

<StatsCards stats={statsData} />
```

#### **5. EmptyState** - Estado Vazio
```tsx
<EmptyState
  icon={Users}
  title="Nenhum item encontrado"
  description="Descrição do estado vazio"
  action={{                       // Ação opcional
    label: 'Criar Novo',
    onClick: handleCreate,
    icon: Plus
  }}
/>
```

#### **6. ErrorMessage** - Mensagens de Erro
```tsx
<ErrorMessage 
  message="Mensagem de erro" 
  variant="error"                 // error | warning | info
  onDismiss={clearError}          // Opcional
/>
```

---

## 🎨 Padrões de Layout

### 📐 Containers e Espaçamentos

#### **Container Principal**
```tsx
// SEMPRE usar esta estrutura
<div className="relative z-0 max-w-7xl mx-auto px-6 py-8">
```

#### **Cards e Containers**
```tsx
// Para cards principais
<div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-6">

// Para formulários
<div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/50 p-8">
```

#### **Grid Layouts**
```tsx
// Grid responsivo padrão
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// Grid de stats (4 colunas)
<div className="grid grid-cols-1 md:grid-cols-4 gap-4">

// Grid de formulário (2 colunas)
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
```

---

## 🎨 Sistema de Cores

### 🌈 Paleta Principal
```css
/* Cores Primárias */
--blue-50: #eff6ff
--blue-500: #3b82f6
--blue-600: #2563eb
--blue-700: #1d4ed8

--indigo-50: #eef2ff
--indigo-500: #6366f1
--indigo-600: #4f46e5

/* Cores de Estado */
--green-500: #10b981    /* Sucesso */
--red-500: #ef4444      /* Erro */
--amber-500: #f59e0b    /* Aviso */
--purple-500: #8b5cf6   /* VIP */
```

### 🎯 Aplicação de Cores

#### **Gradientes Padrão**
```tsx
// Background principal
"bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900"

// Botões primários
"bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"

// Ícones e badges
"bg-gradient-to-br from-blue-500 to-indigo-600"
```

#### **Estados por Tipo de Fila**
```tsx
const getQueueTypeColor = (type: QueueType) => {
  switch (type) {
    case QueueType.GENERAL:
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
    case QueueType.PRIORITY:
      return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
    case QueueType.VIP:
      return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
  }
}
```

---

## ✍️ Tipografia

### 📝 Hierarquia de Títulos
```tsx
// H1 - Título principal da página
<h1 className="text-3xl font-bold text-slate-900 dark:text-white">

// H2 - Título de seção
<h2 className="text-2xl font-bold text-slate-900 dark:text-white">

// H3 - Título de card
<h3 className="text-xl font-semibold text-slate-900 dark:text-white">

// Subtítulo/Descrição
<p className="text-slate-600 dark:text-slate-400">

// Texto de ajuda
<p className="text-sm text-slate-500 dark:text-slate-400">
```

### 🏷️ Labels e Textos de Form
```tsx
// Label de campo
<label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">

// Texto de erro
<p className="text-sm text-red-500 dark:text-red-400">

// Texto de sucesso
<p className="text-sm text-green-600 dark:text-green-400">
```

---

## 📏 Espaçamentos

### 🎯 Padrões de Spacing
```tsx
// Padding de containers
p-6    // Cards normais
p-8    // Formulários e containers maiores

// Margins entre seções
mb-6   // Espaçamento padrão entre elementos
mb-8   // Espaçamento entre seções principais

// Gaps em grids
gap-4  // Stats cards
gap-6  // Cards principais e formulários

// Spacing interno
space-x-3  // Horizontal entre ícone e texto
space-y-2  // Vertical em formulários
```

---

## ⚡ Estados e Interações

### 🎭 Estados Visuais

#### **Botões**
```tsx
// Botão primário
"bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"

// Botão secundário
"bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300"

// Botão de perigo
"bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400"
```

#### **Campos de Input**
```tsx
"bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-500"
```

### 🔄 Transições Padrão
```tsx
"transition-all duration-200"        // Transição geral
"transition-colors"                  // Apenas cores
"transition-transform"               // Apenas transformações
```

---

## 🎣 Hooks Customizados

### 📋 Hooks Disponíveis

#### **useQueues** - Gerenciamento de Filas
```tsx
import { useQueues } from '@/hooks/useQueues'

const {
  queues,
  isLoading,
  error,
  stats,
  loadQueues,
  deleteQueue,
  clearError
} = useQueues()
```

#### **useQueueForm** - Formulário de Fila
```tsx
import { useQueueForm } from '@/hooks/useQueueForm'

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
```

### 🏗️ Estrutura de Hook Customizado
```tsx
export function useMinhaFuncionalidade() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { data: session } = useSession() as { data: NextAuthSession | null }

  // Sincronizar token - OBRIGATÓRIO
  useEffect(() => {
    if (session?.user?.accessToken) {
      console.log('🔑 Sincronizando token da sessão com ApiClient')
      apiClient.setToken(session.user.accessToken)
    }
  }, [session?.user?.accessToken])

  // Lógica do hook...

  return {
    // Estados
    isLoading,
    error,
    // Funções
    minhaFuncao,
    clearError
  }
}
```

---

## ✅ Boas Práticas

### 🔐 Autenticação
```tsx
// SEMPRE verificar sessão
const { data: session, status } = useSession() as { data: NextAuthSession | null, status: string }

// Estado de loading
if (status === 'loading') {
  return <LoadingSpinner />
}
```

### 🎯 Tipagem
```tsx
// SEMPRE tipar interfaces
interface MinhaProps {
  title: string
  description?: string
  onAction: () => void
}

// Usar tipos do sistema
import { NextAuthSession, QueueType } from '@/types'
```

### 📦 Organização de Imports
```tsx
// 1. React e Next
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// 2. Bibliotecas externas
import { useSession } from 'next-auth/react'

// 3. Ícones
import { Users, Plus, Settings } from 'lucide-react'

// 4. Componentes internos
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { PageHeader, FormCard } from '@/components/ui'

// 5. Hooks e utils
import { useQueues } from '@/hooks/useQueues'

// 6. Types
import { NextAuthSession, QueueType } from '@/types'
```

### 🎨 Classes CSS
```tsx
// Usar template literals para classes condicionais
className={`
  base-classes
  ${condition ? 'conditional-classes' : 'other-classes'}
  ${error ? 'error-classes' : ''}
`}
```

### 🔄 Estados de Loading
```tsx
// Loading de página inteira
<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center">
  <LoadingSpinner size="lg" text="Carregando..." />
</div>

// Loading de seção
<div className="flex justify-center py-12">
  <LoadingSpinner size="lg" text="Carregando dados..." />
</div>

// Loading de botão
{isLoading ? (
  <>
    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
    Carregando...
  </>
) : (
  <>
    <Icon className="w-5 h-5 mr-2" />
    Texto do Botão
  </>
)}
```

---

## 🚀 Checklist para Nova Tela

### ✅ Antes de Começar
- [ ] Definir qual tipo de tela (lista, formulário, dashboard)
- [ ] Identificar componentes reutilizáveis necessários
- [ ] Planejar hooks customizados se necessário

### ✅ Durante o Desenvolvimento
- [ ] Usar template base de página
- [ ] Aplicar background e elementos visuais padrão
- [ ] Usar componentes da biblioteca `/components/ui`
- [ ] Seguir padrões de cores e tipografia
- [ ] Implementar estados de loading/error
- [ ] Adicionar tipagem adequada

### ✅ Antes de Finalizar
- [ ] Testar responsividade
- [ ] Verificar modo escuro
- [ ] Validar acessibilidade básica
- [ ] Testar estados de erro
- [ ] Executar lint e build
- [ ] Documentar componentes novos (se criados)

---

## 📚 Exemplos Práticos

### 🎯 Página de Lista
Ver: `/src/app/filas/page.tsx`
- PageHeader com botão de ação
- SearchAndFilters para busca
- StatsCards para métricas
- Grid de cards para items
- EmptyState quando vazio

### 📝 Página de Formulário
Ver: `/src/app/filas/nova/page.tsx`
- FormCard como container
- FormField para inputs
- Hook customizado para lógica
- Estados de sucesso/erro
- Botões de ação padronizados

---

## 🔧 Ferramentas e Recursos

### 🎨 Design Tokens
- **Cores**: Tailwind CSS classes
- **Espaçamentos**: Sistema 4px (1 = 4px)
- **Tipografia**: Inter font family
- **Sombras**: Sistema de elevation

### 🧩 Componentes Base
- **Lucide React**: Para ícones
- **React Hook Form**: Para formulários
- **Zod**: Para validação
- **Next Auth**: Para autenticação

### 📱 Responsividade
- **Mobile First**: Sempre começar com mobile
- **Breakpoints**: sm, md, lg, xl
- **Grid**: Responsive grid system

---

**💡 Lembre-se: Consistência é a chave para uma boa experiência do usuário!**

Sempre que tiver dúvidas, consulte este guia ou veja as implementações existentes como referência.
