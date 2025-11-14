# 🤖 Guia Rápido para Cursor AI

## 📁 Estrutura do Projeto

```
src/
├── app/                    # Next.js App Router
│   ├── filas/             # Páginas de filas (REFERÊNCIA)
│   ├── dashboard/         # Dashboard principal
│   └── login/             # Autenticação
├── components/            
│   ├── ui/                # Componentes reutilizáveis (USAR SEMPRE)
│   └── LoadingSpinner.tsx # Spinner padrão
├── hooks/                 # Hooks customizados
│   ├── useQueues.ts       # Gerenciamento de filas
│   └── useQueueForm.ts    # Formulários de fila
├── lib/                   # Utilitários
│   └── api.ts            # Cliente da API
└── types/                # Definições TypeScript
    └── index.ts          # Tipos principais
```

## 🎯 Componentes Essenciais

### Importação Padrão
```tsx
import {
  PageHeader,      // Cabeçalho de página
  FormCard,        // Container de formulário
  FormField,       // Campo de input
  FormSelect,      // Select estilizado
  FormTextarea,    // Textarea estilizado
  StatsCards,      // Cards de estatísticas
  EmptyState,      // Estado vazio
  ErrorMessage     // Mensagem de erro
} from '@/components/ui'
```

## 🎨 Layout Base OBRIGATÓRIO

```tsx
<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 relative">
  {/* Background Elements - SEMPRE incluir */}
  <div className="absolute inset-0 overflow-hidden z-0">
    <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl"></div>
    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/20 dark:bg-indigo-500/10 rounded-full blur-3xl"></div>
  </div>

  {/* Container Principal - SEMPRE usar */}
  <div className="relative z-0 max-w-7xl mx-auto px-6 py-8">
    {/* Conteúdo aqui */}
  </div>
</div>
```

## 🔧 Padrões de Código

### Autenticação
```tsx
const { data: session, status } = useSession() as { data: NextAuthSession | null, status: string }

if (status === 'loading') {
  return <LoadingSpinner size="lg" text="Carregando..." />
}
```

### Estados de Loading
```tsx
{isLoading && (
  <div className="flex justify-center py-12">
    <LoadingSpinner size="lg" text="Carregando dados..." />
  </div>
)}
```

### Botões Padrão
```tsx
// Botão primário
className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"

// Botão secundário  
className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300"
```

## 📋 Checklist Rápido

### ✅ Para Toda Nova Tela:
- [ ] Usar layout base obrigatório
- [ ] Importar componentes de `/components/ui`
- [ ] Implementar loading states
- [ ] Adicionar verificação de autenticação
- [ ] Seguir padrões de cores e tipografia
- [ ] Usar hooks customizados quando disponível

### ✅ Cores por Tipo:
- **Geral**: `bg-blue-100 text-blue-700`
- **Prioritária**: `bg-amber-100 text-amber-700`  
- **VIP**: `bg-purple-100 text-purple-700`
- **Sucesso**: `bg-green-100 text-green-700`
- **Erro**: `bg-red-100 text-red-700`

## 🚀 Páginas de Referência

### 📊 Lista: `/src/app/filas/page.tsx`
- PageHeader com botão de ação
- SearchAndFilters
- StatsCards  
- Grid de cards
- EmptyState

### 📝 Formulário: `/src/app/filas/nova/page.tsx`
- FormCard como container
- FormField para inputs
- Hook customizado (useQueueForm)
- Estados de sucesso/erro

## 🎯 Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build e verificação
npm run build

# Lint
npm run lint
```

## 💡 Dicas Importantes

1. **SEMPRE** consulte `DESIGN_SYSTEM.md` para padrões detalhados
2. **SEMPRE** use templates em `TEMPLATES.md` como base
3. **NUNCA** crie estilos do zero - use componentes existentes
4. **SEMPRE** teste responsividade e modo escuro
5. **SEMPRE** implemente estados de loading/error

## 🔗 Arquivos Chave

- `DESIGN_SYSTEM.md` - Guia completo de padrões
- `TEMPLATES.md` - Templates prontos para copiar
- `/src/components/ui/index.ts` - Todos os componentes disponíveis
- `/src/app/filas/page.tsx` - Referência para listas
- `/src/app/filas/nova/page.tsx` - Referência para formulários

---

**🎯 Objetivo: Manter consistência visual e de código em 100% das telas!**
