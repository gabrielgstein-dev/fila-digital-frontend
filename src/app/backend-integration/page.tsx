'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { RefreshCw, Activity, Users, Clock, TrendingUp, BarChart3 } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { SessionInfo } from '@/components/TokenStatusWarning';
import { useTokenManager } from '@/stores/token-manager';
import { toast } from 'sonner';
import type { IgniterDashboardMetrics, IgniterChartData, IgniterSessionInfo, NextAuthSession } from '@/types';

export default function IgniterDashboardPage() {
  const { data: session } = useSession();
  const { tokenState, refreshToken, isRefreshing } = useTokenManager();
  
  const [metrics, setMetrics] = useState<IgniterDashboardMetrics | null>(null);
  const [chartData, setChartData] = useState<IgniterChartData | null>(null);
  const [sessionInfo, setSessionInfo] = useState<IgniterSessionInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const loadIgniterData = useCallback(async () => {
    const customSession = session as NextAuthSession | null;
    if (!customSession?.user?.accessToken) return;

    setLoading(true);
    try {
      // Configurar token no cliente
      apiClient.setIgniterToken(customSession.user.accessToken);

      // Carregar dados em paralelo
      const [metricsData, sessionInfoData] = await Promise.all([
        apiClient.getIgniterPrivateMetrics(),
        // apiClient.getIgniterChartData({ type: 'users', period: 'day' }), // Temporariamente desabilitado devido a erro de validação
        apiClient.getIgniterSessionInfo(),
      ]);
      
      // Dados de gráfico mockados temporariamente
      const chartDataResult = {
        tenantId: customSession.user.tenantId || '',
        chartData: {
          labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai'],
          datasets: [{
            label: 'Usuários',
            data: [10, 20, 15, 30, 25],
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 2
          }]
        },
        metadata: {
          generatedAt: new Date().toISOString(),
          requestedBy: customSession.user.name || '',
          period: 'day',
          type: 'users'
        }
      };

      setMetrics(metricsData);
      setChartData(chartDataResult);
      setSessionInfo(sessionInfoData);

      toast.success('Dados carregados', {
        description: 'Dashboard Igniter atualizado com sucesso!',
      });

    } catch (error) {
      console.error('❌ Erro ao carregar dados do Igniter:', error);
      toast.error('Erro ao carregar dados', {
        description: 'Não foi possível carregar os dados do dashboard.',
      });
    } finally {
      setLoading(false);
    }
  }, [session]);

  // Carregar dados do Igniter
  useEffect(() => {
    const customSession = session as NextAuthSession | null;
    if (customSession?.user?.accessToken) {
      loadIgniterData();
    }
  }, [session, loadIgniterData]);

  const handleUpdateMetrics = async () => {
    try {
      await apiClient.updateIgniterMetrics({
        metricType: 'users',
        value: Math.floor(Math.random() * 1000),
        description: 'Atualização manual via dashboard',
      });

      toast.success('Métricas atualizadas!');
      await loadIgniterData(); // Recarregar dados
    } catch {
      toast.error('Erro ao atualizar métricas');
    }
  };

  if (!session) {
    return (
      <div className="container mx-auto p-6">
        <p className="text-gray-600">Você precisa estar logado para acessar esta página.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Igniter</h1>
          <p className="text-gray-600 mt-1">
            Integração NextAuth + Igniter com gerenciamento de token
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <SessionInfo />
          <button
            className={`flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 ${
              loading ? 'cursor-not-allowed' : ''
            }`}
            onClick={loadIgniterData}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Carregando...' : 'Atualizar'}</span>
          </button>
        </div>
      </div>

      {/* Status da Sessão */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Activity className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Status da Sessão</h2>
        </div>
        
        {sessionInfo ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Usuário</p>
              <p className="text-lg">{sessionInfo.userId}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Tenant</p>
              <p className="text-lg">{sessionInfo.tenantId}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Role</p>
              <p className="text-lg capitalize">{sessionInfo.role}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Sessão Iniciada</p>
              <p className="text-lg">
                {new Date(sessionInfo.sessionStart).toLocaleString('pt-BR')}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Última Atividade</p>
              <p className="text-lg">
                {new Date(sessionInfo.lastActivity).toLocaleString('pt-BR')}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Token Expira em</p>
              <p className={`text-lg ${sessionInfo.tokenInfo.shouldRefresh ? 'text-yellow-600' : 'text-green-600'}`}>
                {sessionInfo.tokenInfo.timeToExpire}
              </p>
            </div>
          </div>
        ) : (
          <p>Carregando informações da sessão...</p>
        )}
      </div>

      {/* Métricas do Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center space-x-3">
            <Users className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-sm font-medium text-gray-500">Tickets Totais</p>
              <p className="text-2xl font-bold">
                {metrics?.tenantMetrics.totalTickets || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center space-x-3">
            <Activity className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm font-medium text-gray-500">Agentes Ativos</p>
              <p className="text-2xl font-bold">
                {metrics?.tenantMetrics.activeAgents || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center space-x-3">
            <Clock className="h-8 w-8 text-yellow-500" />
            <div>
              <p className="text-sm font-medium text-gray-500">Tempo Médio</p>
              <p className="text-2xl font-bold">
                {metrics?.tenantMetrics.avgWaitTime || '0min'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-8 w-8 text-purple-500" />
            <div>
              <p className="text-sm font-medium text-gray-500">Fila Atual</p>
              <p className="text-2xl font-bold">
                {metrics?.tenantMetrics.queueLength || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico de Dados */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-2 mb-4">
          <BarChart3 className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Dados do Gráfico</h2>
        </div>
        
        {chartData ? (
          <div>
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-500">
                Período: {chartData.metadata.period} | Tipo: {chartData.metadata.type}
              </p>
              <p className="text-xs text-gray-400">
                Gerado em: {new Date(chartData.metadata.generatedAt).toLocaleString('pt-BR')}
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="font-medium mb-2">Labels:</p>
                <div className="flex flex-wrap gap-2">
                  {chartData.chartData.labels.map((label, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 rounded text-sm">
                      {label}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-medium mb-2">Dados:</p>
                <div className="flex flex-wrap gap-2">
                  {chartData.chartData.datasets[0]?.data.map((value, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                      {value}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p>Carregando dados do gráfico...</p>
        )}
      </div>

      {/* Ações */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Ações do Sistema</h2>
        
        <div className="flex flex-wrap gap-3">
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            onClick={handleUpdateMetrics}
          >
            Atualizar Métricas
          </button>
          
          <button
            className={`flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 ${
              isRefreshing ? 'cursor-not-allowed' : ''
            }`}
            onClick={refreshToken}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Renovando Token...' : 'Renovar Token'}</span>
          </button>

          <button
            className={`px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 ${
              loading ? 'cursor-not-allowed' : ''
            }`}
            onClick={loadIgniterData}
            disabled={loading}
          >
            Recarregar Dados
          </button>
        </div>
      </div>

      {/* Debug Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Debug - Estado do Token</h2>
        <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto">
          {JSON.stringify(tokenState, null, 2)}
        </pre>
      </div>
    </div>
  );
}