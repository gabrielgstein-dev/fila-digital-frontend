# 📊 Exemplo: Página de Dashboard

## 📁 Baseado em: `/src/app/backend-integration/page.tsx`

Este exemplo mostra como implementar uma página de dashboard seguindo o design system.

## 🎯 Estrutura Completa

```tsx
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  Activity,
  Clock,
  Server,
  Database,
  Zap
} from 'lucide-react'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { 
  PageHeader,
  StatsCards,
  ErrorMessage
} from '@/components/ui'
import { NextAuthSession } from '@/types'

export default function DashboardPage() {
  const { status } = useSession() as { data: NextAuthSession | null, status: string }
  
  // Estados do dashboard
  const [metrics, setMetrics] = useState<any>(null)
  const [chartData, setChartData] = useState<any>(null)
  const [sessionInfo, setSessionInfo] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Carregar dados do dashboard
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Simular carregamento de dados
        const [metricsData, chartDataResult, sessionData] = await Promise.all([
          loadMetrics(),
          loadChartData(),
          loadSessionInfo()
        ])

        setMetrics(metricsData)
        setChartData(chartDataResult)
        setSessionInfo(sessionData)
      } catch (err) {
        setError('Erro ao carregar dados do dashboard')
        console.error('Dashboard error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  // Funções de carregamento de dados
  const loadMetrics = async () => {
    // Implementar chamada da API
    return {
      totalUsers: 1250,
      activeQueues: 8,
      avgWaitTime: 12,
      serverUptime: 99.8
    }
  }

  const loadChartData = async () => {
    // Implementar chamada da API
    return {
      labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai'],
      datasets: [{
        label: 'Usuários Ativos',
        data: [120, 150, 180, 220, 250],
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2
      }]
    }
  }

  const loadSessionInfo = async () => {
    return {
      connectedUsers: 45,
      activeConnections: 12,
      lastSync: new Date().toISOString()
    }
  }

  // Dados para stats cards
  const statsData = [
    {
      title: 'Total de Usuários',
      value: metrics?.totalUsers || 0,
      icon: Users,
      gradient: 'bg-gradient-to-br from-blue-500 to-indigo-600'
    },
    {
      title: 'Filas Ativas',
      value: metrics?.activeQueues || 0,
      icon: Activity,
      gradient: 'bg-gradient-to-br from-green-500 to-emerald-600'
    },
    {
      title: 'Tempo Médio',
      value: `${metrics?.avgWaitTime || 0}min`,
      icon: Clock,
      gradient: 'bg-gradient-to-br from-amber-500 to-orange-600'
    },
    {
      title: 'Uptime',
      value: `${metrics?.serverUptime || 0}%`,
      icon: Server,
      gradient: 'bg-gradient-to-br from-purple-500 to-pink-600'
    }
  ]

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
          icon={BarChart3}
          title="Dashboard Executivo"
          description="Visão geral das métricas e performance do sistema"
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

        {/* Stats Cards - Sempre primeiro no dashboard */}
        {!isLoading && (
          <StatsCards stats={statsData} />
        )}

        {/* Dashboard Content Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Gráfico Principal */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Crescimento de Usuários
                </h3>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Últimos 5 meses
                </div>
              </div>
              
              {/* Área do gráfico */}
              <div className="h-64 flex items-center justify-center bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-500 dark:text-slate-400">
                    Gráfico de Crescimento
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {chartData?.datasets?.[0]?.data?.join(' → ')}
                  </p>
                </div>
              </div>
            </div>

            {/* Informações do Sistema */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6 flex items-center">
                <Database className="w-5 h-5 mr-2" />
                Status do Sistema
              </h3>
              
              <div className="space-y-4">
                {/* Status Item */}
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-slate-700 dark:text-slate-300">
                      Conexões Ativas
                    </span>
                  </div>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {sessionInfo?.activeConnections || 0}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-slate-700 dark:text-slate-300">
                      Usuários Conectados
                    </span>
                  </div>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {sessionInfo?.connectedUsers || 0}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-amber-500 rounded-full mr-3"></div>
                    <span className="text-slate-700 dark:text-slate-300">
                      Última Sincronização
                    </span>
                  </div>
                  <span className="font-semibold text-slate-900 dark:text-white text-sm">
                    {sessionInfo?.lastSync ? 
                      new Date(sessionInfo.lastSync).toLocaleTimeString() : 
                      '--:--'
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Segunda linha de widgets */}
        {!isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Widget de Performance */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-6">
              <h4 className="text-md font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                <Zap className="w-4 h-4 mr-2" />
                Performance
              </h4>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600 dark:text-slate-400">CPU</span>
                    <span className="text-slate-900 dark:text-white">45%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600 dark:text-slate-400">Memória</span>
                    <span className="text-slate-900 dark:text-white">67%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '67%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600 dark:text-slate-400">Disco</span>
                    <span className="text-slate-900 dark:text-white">23%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div className="bg-amber-500 h-2 rounded-full" style={{ width: '23%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Widget de Atividades Recentes */}
            <div className="lg:col-span-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-6">
              <h4 className="text-md font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                <Activity className="w-4 h-4 mr-2" />
                Atividades Recentes
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-900 dark:text-white">
                      Nova fila criada: "Atendimento Express"
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      há 2 minutos
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-900 dark:text-white">
                      15 usuários entraram na fila "Atendimento Geral"
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      há 5 minutos
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-900 dark:text-white">
                      Sistema sincronizado com sucesso
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      há 10 minutos
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
```

## 🔑 Pontos Chave

### ✅ **Estrutura Obrigatória**
1. **Layout base** com background e elementos decorativos
2. **PageHeader** sem botão de ação (dashboard não precisa)
3. **StatsCards** sempre primeiro
4. **Grid responsivo** para widgets

### ✅ **Organização do Dashboard**
- **Stats cards** no topo - métricas principais
- **Grid 2 colunas** para widgets principais
- **Grid 3 colunas** para widgets menores
- **Hierarquia visual** clara

### ✅ **Componentes Utilizados**
- `PageHeader` - Cabeçalho da página
- `StatsCards` - Métricas principais
- `ErrorMessage` - Tratamento de erros
- `LoadingSpinner` - Estados de carregamento

### ✅ **Estados de Dados**
- Loading durante carregamento
- Error para problemas de API
- Success com dados carregados
- Refresh automático (opcional)

### ✅ **Widgets Padrão**
- **Gráficos** - Com placeholder visual
- **Status do sistema** - Lista de status
- **Performance** - Barras de progresso
- **Atividades** - Timeline de eventos

## 🎨 Resultado Visual

Esta implementação garante:
- ✅ Layout dashboard profissional
- ✅ Métricas bem organizadas
- ✅ Widgets informativos
- ✅ Responsividade completa
- ✅ Modo escuro funcional

## 🔄 Adaptação para Outros Dashboards

Para adaptar para outros contextos:

1. **Trocar métricas**: Ajustar statsData conforme necessário
2. **Personalizar widgets**: Criar widgets específicos
3. **Integrar APIs**: Conectar com endpoints reais
4. **Manter estrutura**: Layout e padrões iguais

## 📊 Tipos de Widgets Comuns

### 📈 **Gráficos**
- Line charts para tendências
- Bar charts para comparações
- Pie charts para distribuições
- Area charts para volumes

### 📋 **Listas**
- Atividades recentes
- Top usuários
- Alertas importantes
- Tarefas pendentes

### 📊 **Métricas**
- KPIs principais
- Performance indicators
- Status operacionais
- Comparações período

### 🔧 **Controles**
- Filtros de tempo
- Seletores de dados
- Botões de ação rápida
- Configurações visuais

