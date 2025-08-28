# Implementação do Sistema de Login para Tenants com NextAuth

## Visão Geral

Este documento descreve a implementação do sistema de login para tenants no backoffice da Fila Digital usando **NextAuth.js**, substituindo as funcionalidades antigas de "Tirar Senha" e "Display".

## Mudanças Implementadas

### 1. Remoção de Funcionalidades Antigas
- ❌ Funcionalidade "Tirar Senha (Demo)"
- ❌ Funcionalidade "Painel de Display (Demo)"
- ❌ Acesso administrativo genérico

### 2. Nova Estrutura de Autenticação com NextAuth
- ✅ Sistema de login exclusivo para tenants
- ✅ Autenticação via CPF e senha
- ✅ **NextAuth.js** para gerenciamento de sessões
- ✅ Integração nativa com Next.js
- ✅ Proteção de rotas autenticadas
- ✅ Gerenciamento de estado de sessão integrado
- ✅ **`/login` como tela principal** para usuários não autenticados

## Arquitetura Técnica

### Bibliotecas Utilizadas
- **NextAuth.js**: Sistema de autenticação completo
- **React Hook Form**: Formulários com validação
- **Zod**: Validação de esquemas
- **Lucide React**: Ícones

### Estrutura de Arquivos
```
src/
├── lib/
│   └── auth.ts                    # Configuração do NextAuth
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts       # Rota da API do NextAuth
│   ├── login/
│   │   └── page.tsx               # Página principal (login + landing)
│   ├── dashboard/
│   │   └── page.tsx               # Dashboard principal
│   └── page.tsx                   # Página de redirecionamento
├── components/
│   ├── Providers.tsx              # Providers (NextAuth + Theme)
│   ├── ProtectedRoute.tsx         # Componente de proteção de rotas
│   └── ThemeToggle.tsx            # Toggle de tema
├── config/
│   └── env.ts                     # Configuração de ambiente
├── types/
│   └── next-auth.d.ts             # Extensões de tipos do NextAuth
└── middleware.ts                   # Middleware de autenticação
```

## Fluxo de Navegação

### Usuários Não Autenticados
1. **Acesso a qualquer rota** → Redirecionado para `/login`
2. **`/login`** → Tela principal com formulário de login + informações do sistema
3. **Login bem-sucedido** → Redirecionado para `/dashboard`

### Usuários Autenticados
1. **Acesso a `/login`** → Redirecionado para `/dashboard` (ou rota anterior)
2. **Acesso a rotas protegidas** → Acesso permitido
3. **Logout** → Redirecionado para `/login`

## Configuração do NextAuth

### Estratégia de Autenticação
- **Credentials Provider**: Autenticação personalizada com CPF e senha
- **JWT Strategy**: Sessões baseadas em JWT
- **Callbacks Customizados**: Para incluir dados do tenant e role
- **Redirect Callback**: Gerenciamento inteligente de redirecionamentos

### Endpoints da API
- `POST /api/auth/signin` - Login via NextAuth
- `POST /api/auth/signout` - Logout via NextAuth
- `GET /api/auth/session` - Verificar sessão atual

### Dados do Usuário
- Retorna informações do agente/tenant
- Inclui role (ADMIN, MANAGER, ATTENDANT)
- Inclui dados da empresa (tenant)
- Token de acesso para requisições à API

## Middleware de Autenticação

### Funcionalidades
- **Proteção automática** de rotas autenticadas
- **Redirecionamento inteligente** para usuários logados
- **Preservação de callbackUrl** para retorno após login
- **Controle granular** de acesso por rota

### Configuração
```typescript
export default withAuth(
  function middleware(req) {
    // Lógica de redirecionamento
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Controle de autorização
      },
    },
  }
)
```

## Fluxo de Autenticação

1. **Acesso Inicial**: Usuário acessa qualquer rota e é redirecionado para `/login`
2. **Tela Principal**: `/login` exibe formulário + informações do sistema
3. **Login**: Usuário insere CPF e senha
4. **Validação**: Credenciais são validadas via API fila-api
5. **Sessão**: NextAuth cria e gerencia a sessão do usuário
6. **Redirecionamento**: Após login bem-sucedido, usuário é redirecionado para `/dashboard`
7. **Proteção**: Rotas autenticadas são protegidas pelo middleware
8. **Logout**: Usuário pode fazer logout e é redirecionado para `/login`

## Configuração de Ambiente

### Variáveis Necessárias
```env
# API Backend
NEXT_PUBLIC_API_URL=https://fila-api-397713505626.us-central1.run.app

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Aplicação
NEXT_PUBLIC_APP_NAME="Fila Digital"
NEXT_PUBLIC_VERSION="1.0.0"
```

## Funcionalidades do Dashboard

### Informações Exibidas
- Nome do usuário logado (via NextAuth session)
- Função/role no sistema
- Nome da empresa (tenant)
- Lista de funcionalidades disponíveis

### Ações Disponíveis
- Alternar tema (claro/escuro)
- Fazer logout (via NextAuth signOut)
- Navegar para funcionalidades futuras

## Segurança

### Validações Implementadas
- CPF deve ter exatamente 11 dígitos numéricos
- Senha é obrigatória
- Rate limiting na API (5 tentativas por minuto)
- Tokens JWT para autenticação

### Proteções do NextAuth
- Sessões seguras com JWT
- Proteção automática de rotas via middleware
- Gerenciamento de estado de sessão
- Logout automático em expiração
- CSRF protection integrado
- Redirecionamento inteligente

## Vantagens do NextAuth

### Comparado à Implementação Anterior
- ✅ **Integração Nativa**: Melhor integração com Next.js
- ✅ **Segurança**: Proteções de segurança integradas
- ✅ **Manutenibilidade**: Código mais limpo e padrão
- ✅ **Escalabilidade**: Fácil adição de novos provedores
- ✅ **Performance**: Otimizações automáticas do Next.js
- ✅ **Middleware**: Suporte a middleware de autenticação
- ✅ **Redirecionamento Inteligente**: Preserva rota de origem

### Recursos Adicionais
- Refresh token automático
- Múltiplos provedores de autenticação
- Callbacks customizáveis
- Middleware de proteção
- Integração com banco de dados
- Gerenciamento de sessões avançado

## Próximos Passos

### Funcionalidades Planejadas
- [ ] Gerenciamento de filas
- [ ] Controle de atendimentos
- [ ] Relatórios e estatísticas
- [ ] Configurações do sistema
- [ ] Gerenciamento de usuários
- [ ] Integração com WebSocket para tempo real

### Melhorias Técnicas
- [ ] Adicionar provedores OAuth (Google, Microsoft)
- [ ] Implementar refresh token automático
- [ ] Adicionar middleware de autenticação
- [ ] Cache inteligente com React Query
- [ ] Testes unitários e de integração
- [ ] Monitoramento de performance

## Como Testar

1. **Desenvolvimento Local**
   ```bash
   pnpm dev
   ```

2. **Configurar Variáveis de Ambiente**
   ```bash
   cp env.example .env.local
   # Editar .env.local com suas configurações
   ```

3. **Acessar Aplicação**
   - Abrir `http://localhost:3000`
   - Será redirecionado para `/login` (tela principal)

4. **Fazer Login**
   - Usar CPF e senha válidos de um tenant
   - Após login, será redirecionado para `/dashboard`

5. **Testar Funcionalidades**
   - Alternar tema
   - Fazer logout
   - Verificar proteção de rotas
   - Testar redirecionamentos

## Notas Importantes

- O sistema agora usa **NextAuth.js** para autenticação
- **`/login` é a tela principal** para usuários não autenticados
- Sessões são gerenciadas automaticamente pelo NextAuth
- O estado de autenticação é persistido via cookies seguros
- A API fila-api é chamada apenas durante o login
- Todas as rotas autenticadas são protegidas automaticamente
- O sistema é exclusivo para tenants
- **Middleware controla redirecionamentos** de forma inteligente

## Migração de Zustand para NextAuth

### Arquivos Removidos
- `src/contexts/AuthContext.tsx` - Substituído pelo NextAuth
- `src/hooks/useAuth.ts` - Substituído pelos hooks do NextAuth
- `src/providers/QueryProvider.tsx` - Não mais necessário

### Mudanças nos Componentes
- `useAuthStore()` → `useSession()`
- `login()` → `signIn()`
- `logout()` → `signOut()`
- `isAuthenticated` → `status === 'authenticated'`

### Benefícios da Migração
- Código mais limpo e padrão
- Melhor integração com Next.js
- Mais recursos de segurança
- Fácil manutenção e escalabilidade
- **Redirecionamento inteligente** preservando rota de origem
