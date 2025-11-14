# 🤖 Guia Completo para IA - Design System Fila Backoffice

## 🎯 INSTRUÇÕES OBRIGATÓRIAS PARA IA

### 🚨 **SEMPRE SEGUIR ESTES PADRÕES - SEM EXCEÇÕES**

1. **NUNCA crie estilos do zero** - use apenas os componentes e classes documentados
2. **SEMPRE use o layout base** - background gradient + elementos decorativos + container
3. **SEMPRE importe componentes** de `/components/ui`
4. **SEMPRE implemente estados** de loading, error e success
5. **SEMPRE use hooks customizados** quando disponíveis
6. **SEMPRE teste responsividade** e modo escuro

---

## 📁 ESTRUTURA DO PROJETO (OBRIGATÓRIO CONHECER)

```
src/
├── app/                        # Next.js App Router
│   ├── filas/                 # 📋 REFERÊNCIA PRINCIPAL
│   │   ├── page.tsx           # ✅ Exemplo perfeito de LISTA
│   │   └── nova/page.tsx      # ✅ Exemplo perfeito de FORMULÁRIO
│   ├── dashboard/             # Dashboard principal
│   └── backend-integration/   # ✅ Exemplo de DASHBOARD
├── components/
│   ├── ui/                    # 🧩 COMPONENTES OBRIGATÓRIOS
│   │   ├── index.ts          # Importação centralizada
│   │   ├── PageHeader.tsx    # Cabeçalho de página
│   │   ├── FormCard.tsx      # Container de formulário
│   │   ├── FormField.tsx     # Campos de input
│   │   ├── StatsCards.tsx    # Cards de estatísticas
│   │   ├── EmptyState.tsx    # Estado vazio
│   │   └── ErrorMessage.tsx  # Mensagens de erro
│   └── LoadingSpinner.tsx    # Spinner padrão
├── hooks/                     # Hooks customizados
│   ├── useQueues.ts          # ✅ Exemplo de hook para listas
│   └── useQueueForm.ts       # ✅ Exemplo de hook para formulários
└── types/
    └── index.ts              # Tipos TypeScript
```

---

## 🎨 LAYOUT BASE OBRIGATÓRIO

### **TODA página DEVE usar esta estrutura:**

```tsx
<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 relative">
  {/* Background Elements - OBRIGATÓRIO */}
  <div className="absolute inset-0 overflow-hidden z-0">
    <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl"></div>
    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/20 dark:bg-indigo-500/10 rounded-full blur-3xl"></div>
  </div>

  {/* Main Content - SEMPRE usar */}
  <div className="relative z-0 max-w-7xl mx-auto px-6 py-8">
    {/* Conteúdo da página aqui */}
  </div>
</div>
```

---

## 🧩 COMPONENTES OBRIGATÓRIOS

### **Importação Padrão (SEMPRE usar):**
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
  SearchAndFilters
} from '@/components/ui'
```

### **1. PageHeader - OBRIGATÓRIO em toda página**
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

### **2. FormCard - OBRIGATÓRIO para formulários**
```tsx
<FormCard
  title="Título do Formulário"
  subtitle="Subtítulo explicativo"
  badge={{                        // Badge opcional
    label: 'Status',
    icon: Settings
  }}
>
  {/* Conteúdo do formulário */}
</FormCard>
```

### **3. FormField - OBRIGATÓRIO para inputs**
```tsx
<FormField
  {...register('fieldName')}      // React Hook Form
  id="fieldName"
  label="Nome do Campo"
  icon={Hash}                     // Ícone opcional
  placeholder="Placeholder"
  error={errors.fieldName}        // Erro de validação
  helperText="Texto de ajuda"     // Opcional
  required                        // Opcional
/>
```

### **4. StatsCards - OBRIGATÓRIO para métricas**
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

### **5. EmptyState - OBRIGATÓRIO quando lista vazia**
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

---

## 🎨 CLASSES CSS OBRIGATÓRIAS

### **Container Principal:**
```tsx
className="relative z-0 max-w-7xl mx-auto px-6 py-8"
```

### **Cards/Containers:**
```tsx
// Cards normais
className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-6"

// Formulários
className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/50 p-8"
```

### **Botões:**
```tsx
// Primário
className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"

// Secundário
className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300"

// Perigo
className="bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400"
```

### **Inputs:**
```tsx
className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
```

### **Grid Layouts:**
```tsx
// Grid responsivo padrão
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"

// Grid de stats (4 colunas)
className="grid grid-cols-1 md:grid-cols-4 gap-4"

// Grid de formulário (2 colunas)
className="grid grid-cols-1 md:grid-cols-2 gap-6"
```

---

## 🎨 SISTEMA DE CORES OBRIGATÓRIO

### **Gradientes por Contexto:**
```tsx
// Azul - Para totais/principais
'bg-gradient-to-br from-blue-500 to-indigo-600'

// Verde - Para ativos/positivos
'bg-gradient-to-br from-green-500 to-emerald-600'

// Âmbar - Para tempo/duração/avisos
'bg-gradient-to-br from-amber-500 to-orange-600'

// Roxo - Para VIP/capacidade
'bg-gradient-to-br from-purple-500 to-pink-600'

// Vermelho - Para erros/alertas
'bg-gradient-to-br from-red-500 to-rose-600'
```

### **Estados por Tipo:**
```tsx
// Geral
'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'

// Prioritário
'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'

// VIP
'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'

// Sucesso
'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'

// Erro
'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
```

---

## 🔄 ESTADOS OBRIGATÓRIOS

### **Loading State (SEMPRE implementar):**
```tsx
// Loading de página inteira
if (status === 'loading') {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center">
      <LoadingSpinner size="lg" text="Carregando..." />
    </div>
  )
}

// Loading de seção
{isLoading && (
  <div className="flex justify-center py-12">
    <LoadingSpinner size="lg" text="Carregando dados..." />
  </div>
)}
```

### **Error State (SEMPRE implementar):**
```tsx
{error && (
  <ErrorMessage 
    message={error} 
    onDismiss={() => setError(null)}
  />
)}
```

### **Empty State (SEMPRE implementar para listas):**
```tsx
{!isLoading && items.length === 0 && (
  <EmptyState
    icon={Users}
    title="Nenhum item encontrado"
    description="Descrição apropriada"
    action={{
      label: 'Criar Primeiro Item',
      onClick: handleCreate,
      icon: Plus
    }}
  />
)}
```

---

## 🎣 HOOKS CUSTOMIZADOS OBRIGATÓRIOS

### **Para Listas - useQueues (exemplo):**
```tsx
import { useQueues } from '@/hooks/useQueues'

const {
  queues,          // Dados da lista
  isLoading,       // Estado de carregamento
  error,           // Erro se houver
  stats,           // Estatísticas
  loadQueues,      // Função para recarregar
  deleteQueue,     // Função para deletar
  clearError       // Limpar erro
} = useQueues()
```

### **Para Formulários - useQueueForm (exemplo):**
```tsx
import { useQueueForm } from '@/hooks/useQueueForm'

const {
  register,        // React Hook Form register
  formState: { errors }, // Erros de validação
  isLoading,       // Estado de submit
  error,           // Erro de API
  success,         // Sucesso
  onSubmit,        // Handler de submit
  handleBack,      // Voltar página
  clearError       // Limpar erro
} = useQueueForm()
```

---

## 📋 TEMPLATES OBRIGATÓRIOS POR TIPO

### **1. PÁGINA DE LISTA:**
1. Layout base obrigatório
2. PageHeader com botão de ação
3. SearchAndFilters para busca
4. StatsCards para métricas
5. Grid de cards para items
6. EmptyState quando vazio
7. Estados de loading/error

### **2. PÁGINA DE FORMULÁRIO:**
1. Layout base obrigatório
2. Header com botão voltar
3. FormCard como container
4. FormField para inputs
5. Grid responsivo (2 colunas)
6. Botões de ação no final
7. Estados de loading/error/success

### **3. PÁGINA DE DASHBOARD:**
1. Layout base obrigatório
2. PageHeader sem botão de ação
3. StatsCards no topo
4. Grid de widgets responsivo
5. Gráficos e métricas
6. Estados de loading/error

---

## ✅ CHECKLIST OBRIGATÓRIO PARA IA

### **Antes de Criar Qualquer Tela:**
- [ ] Identifiquei o tipo: Lista, Formulário ou Dashboard?
- [ ] Vou usar o layout base obrigatório?
- [ ] Vou importar componentes de `/components/ui`?
- [ ] Vou implementar todos os estados (loading, error, empty)?
- [ ] Vou usar hooks customizados se disponíveis?

### **Durante o Desenvolvimento:**
- [ ] Usei PageHeader no topo?
- [ ] Implementei responsividade (grid)?
- [ ] Usei classes CSS obrigatórias?
- [ ] Segui sistema de cores?
- [ ] Implementei modo escuro?

### **Antes de Finalizar:**
- [ ] Testei todos os estados?
- [ ] Verifiquei responsividade?
- [ ] Validei modo escuro?
- [ ] Usei tipagem TypeScript?
- [ ] Segui padrões de nomenclatura?

---

## 🚨 ERROS COMUNS QUE A IA DEVE EVITAR

### **❌ NUNCA FAÇA:**
1. Criar estilos CSS customizados do zero
2. Usar cores fora do sistema estabelecido
3. Esquecer estados de loading/error
4. Não usar componentes de `/components/ui`
5. Não implementar responsividade
6. Esquecer modo escuro
7. Não seguir o layout base obrigatório
8. Criar novos componentes sem necessidade

### **✅ SEMPRE FAÇA:**
1. Use templates como base
2. Importe componentes centralizados
3. Implemente todos os estados
4. Siga sistema de cores
5. Use hooks customizados
6. Mantenha consistência visual
7. Teste responsividade
8. Valide tipagem TypeScript

---

## 📚 ARQUIVOS DE REFERÊNCIA OBRIGATÓRIOS

### **Para Entender o Sistema:**
1. `design-patterns.md` - Padrões completos
2. `components.md` - Guia de componentes
3. `templates.md` - Templates prontos

### **Para Ver Exemplos:**
1. `/src/app/filas/page.tsx` - Lista perfeita
2. `/src/app/filas/nova/page.tsx` - Formulário perfeito
3. `/src/app/backend-integration/page.tsx` - Dashboard
4. `/src/components/ui/` - Todos os componentes

### **Para Copiar Código:**
1. `examples/list-page-example.md`
2. `examples/form-page-example.md`
3. `examples/dashboard-example.md`

---

## 🎯 OBJETIVO FINAL

**A IA deve ser capaz de criar qualquer tela nova mantendo 100% de consistência visual e de código com o sistema existente, usando apenas os padrões, componentes e classes documentados.**

**NUNCA invente ou crie do zero - sempre use o que já está estabelecido!**

