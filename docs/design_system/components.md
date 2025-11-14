# 🧩 Guia de Componentes

## 📦 Biblioteca de Componentes UI

Todos os componentes estão disponíveis em `/src/components/ui/` e podem ser importados de forma centralizada:

```tsx
import {
  PageHeader,
  FormCard,
  FormField,
  FormSelect,
  FormTextarea,
  StatsCards,
  QueueCard,
  EmptyState,
  ErrorMessage,
  SearchAndFilters,
  QueueSearchAndFilters
} from '@/components/ui'
```

---

## 🏷️ PageHeader

**Uso**: Cabeçalho padronizado para todas as páginas

### Props
```tsx
interface PageHeaderProps {
  icon: LucideIcon        // Ícone obrigatório
  title: string          // Título obrigatório
  description?: string   // Descrição opcional
  action?: {             // Botão de ação opcional
    label: string
    onClick: () => void
    icon?: LucideIcon
  }
}
```

### Exemplo
```tsx
<PageHeader
  icon={Users}
  title="Gerenciar Filas"
  description="Controle suas filas de atendimento"
  action={{
    label: 'Nova Fila',
    onClick: () => router.push('/filas/nova'),
    icon: Plus
  }}
/>
```

### Quando Usar
- ✅ **Sempre** no topo de páginas principais
- ✅ Para manter consistência visual
- ✅ Quando precisar de botão de ação no cabeçalho

---

## 📝 FormCard

**Uso**: Container padronizado para formulários

### Props
```tsx
interface FormCardProps {
  title: string
  subtitle?: string
  badge?: {
    label: string
    icon?: LucideIcon
  }
  children: React.ReactNode
  className?: string
}
```

### Exemplo
```tsx
<FormCard
  title="Criar Nova Fila"
  subtitle="Preencha os dados da fila"
  badge={{
    label: 'Configuração',
    icon: Settings
  }}
>
  {/* Formulário aqui */}
</FormCard>
```

### Quando Usar
- ✅ **Sempre** para formulários
- ✅ Para manter visual glassmorphism
- ✅ Quando precisar de badge de status

---

## 📋 FormField

**Uso**: Campo de input padronizado

### Props
```tsx
interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  icon?: LucideIcon
  error?: FieldError
  helperText?: string
  required?: boolean
}
```

### Exemplo
```tsx
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
```

### Variantes
- **FormSelect**: Para dropdowns
- **FormTextarea**: Para campos de texto longo

### Quando Usar
- ✅ **Sempre** para inputs em formulários
- ✅ Para manter consistência visual
- ✅ Quando precisar de validação visual

---

## 📊 StatsCards

**Uso**: Cards de estatísticas/métricas

### Props
```tsx
interface StatsCardsProps {
  stats: Array<{
    title: string
    value: string | number
    icon: LucideIcon
    gradient: string
  }>
}
```

### Exemplo
```tsx
const statsData = [
  {
    title: 'Total de Filas',
    value: 15,
    icon: Users,
    gradient: 'bg-gradient-to-br from-blue-500 to-indigo-600'
  },
  {
    title: 'Filas Ativas',
    value: 12,
    icon: Sparkles,
    gradient: 'bg-gradient-to-br from-green-500 to-emerald-600'
  }
]

<StatsCards stats={statsData} />
```

### Gradientes Padrão
```tsx
// Azul - Para totais/principais
'bg-gradient-to-br from-blue-500 to-indigo-600'

// Verde - Para ativos/positivos
'bg-gradient-to-br from-green-500 to-emerald-600'

// Âmbar - Para tempo/duração
'bg-gradient-to-br from-amber-500 to-orange-600'

// Roxo - Para capacidade/VIP
'bg-gradient-to-br from-purple-500 to-pink-600'

// Vermelho - Para alertas/inativos
'bg-gradient-to-br from-red-500 to-rose-600'
```

### Quando Usar
- ✅ **Sempre** para mostrar métricas
- ✅ Em dashboards e páginas de lista
- ✅ Para dar contexto numérico

---

## 🃏 QueueCard

**Uso**: Card específico para exibir informações de fila

### Props
```tsx
interface QueueCardProps {
  queue: Queue
  onView: (queueId: string) => void
  onEdit: (queueId: string) => void
  onDelete: (queueId: string) => void
}
```

### Exemplo
```tsx
<QueueCard
  queue={fila}
  onView={(id) => router.push(`/filas/${id}`)}
  onEdit={(id) => router.push(`/filas/${id}/editar`)}
  onDelete={handleDelete}
/>
```

### Quando Usar
- ✅ Para listar filas especificamente
- ✅ Quando precisar de ações (ver, editar, excluir)
- ✅ Para manter consistência com outras entidades

---

## 🔍 SearchAndFilters

**Uso**: Barra de busca e filtros

### Props
```tsx
interface SearchAndFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  filterValue: string
  onFilterChange: (value: string) => void
  filterOptions: Array<{value: string, label: string}>
  searchPlaceholder?: string
}
```

### Exemplo Genérico
```tsx
<SearchAndFilters
  searchTerm={searchTerm}
  onSearchChange={setSearchTerm}
  filterValue={filterType}
  onFilterChange={setFilterType}
  filterOptions={[
    { value: 'ALL', label: 'Todos' },
    { value: 'ACTIVE', label: 'Ativos' }
  ]}
  searchPlaceholder="Buscar items..."
/>
```

### Exemplo Específico (Filas)
```tsx
<QueueSearchAndFilters
  searchTerm={searchTerm}
  onSearchChange={setSearchTerm}
  filterType={filterType}
  onFilterChange={setFilterType}
/>
```

### Quando Usar
- ✅ **Sempre** em páginas de lista
- ✅ Quando tiver muitos items para filtrar
- ✅ Para melhorar UX de busca

---

## 🚫 EmptyState

**Uso**: Estado quando não há dados para mostrar

### Props
```tsx
interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
    icon?: LucideIcon
  }
}
```

### Exemplo
```tsx
<EmptyState
  icon={Users}
  title="Nenhuma fila encontrada"
  description="Comece criando sua primeira fila de atendimento"
  action={{
    label: 'Criar Primeira Fila',
    onClick: () => router.push('/filas/nova'),
    icon: Plus
  }}
/>
```

### Quando Usar
- ✅ **Sempre** quando listas estão vazias
- ✅ Para guiar usuário na primeira ação
- ✅ Para manter experiência consistente

---

## ⚠️ ErrorMessage

**Uso**: Exibir mensagens de erro

### Props
```tsx
interface ErrorMessageProps {
  message: string
  variant?: 'error' | 'warning' | 'info'
  onDismiss?: () => void
}
```

### Exemplo
```tsx
<ErrorMessage 
  message="Erro ao carregar dados. Tente novamente." 
  variant="error"
  onDismiss={() => setError(null)}
/>
```

### Variantes
- **error**: Vermelho - para erros críticos
- **warning**: Âmbar - para avisos
- **info**: Azul - para informações

### Quando Usar
- ✅ **Sempre** para mostrar erros
- ✅ Para feedback de ações
- ✅ Para manter consistência de mensagens

---

## 🔄 LoadingSpinner

**Uso**: Indicador de carregamento

### Props
```tsx
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
}
```

### Exemplo
```tsx
// Loading de página inteira
<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center">
  <LoadingSpinner size="lg" text="Carregando..." />
</div>

// Loading de seção
<div className="flex justify-center py-12">
  <LoadingSpinner size="lg" text="Carregando dados..." />
</div>
```

### Quando Usar
- ✅ **Sempre** para estados de carregamento
- ✅ Em páginas, seções ou botões
- ✅ Para feedback visual ao usuário

---

## 🎨 Padrões Visuais dos Componentes

### 🎯 Container Base
```tsx
// Para cards principais
"bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50"

// Para formulários  
"bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/50"
```

### 🎯 Botões
```tsx
// Primário
"bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"

// Secundário
"bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300"

// Perigo
"bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400"
```

### 🎯 Inputs
```tsx
"bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-500"
```

---

## ✅ Checklist de Componentes

### 🎯 Ao Usar Componentes:
- [ ] Importar de `/components/ui`
- [ ] Seguir props obrigatórias
- [ ] Usar variantes adequadas
- [ ] Testar modo escuro
- [ ] Verificar responsividade

### 🎯 Ao Criar Novos Componentes:
- [ ] Seguir padrões visuais estabelecidos
- [ ] Adicionar ao `/components/ui/index.ts`
- [ ] Documentar props e exemplos
- [ ] Implementar modo escuro
- [ ] Adicionar a esta documentação

---

**💡 Lembre-se: Sempre use componentes existentes antes de criar novos!**

