import { Igniter } from '@igniter-js/core';
import { createBackofficeContext, type BackofficeContext } from './context';

export const igniter = Igniter.context<BackofficeContext>(createBackofficeContext()).create();

// Controlador de API básico
const apiController = igniter.controller({
  name: 'api',
  path: '/api',
  actions: {
    health: igniter.query({
      path: '/health',
      handler: async () => {
        return {
          status: 'ok',
          timestamp: new Date().toISOString(),
          service: 'fila-backoffice',
          integration: 'nextjs-api-routes',
        };
      },
    }),
  },
});

// Controlador de Dashboard (integrado do backend)
const dashboardController = igniter.controller({
  name: 'dashboard',
  path: '/dashboard',
  actions: {
    metrics: igniter.query({
      path: '/metrics',
      handler: async () => {
        return {
          totalUsers: 150,
          activeQueues: 8,
          avgWaitTime: '12min',
          systemStatus: 'operational',
          source: 'nextjs-backoffice',
        };
      },
    }),
    
    status: igniter.query({
      path: '/status',
      handler: async () => {
        return {
          backoffice: 'running',
          database: 'connected',
          integration: 'active',
          timestamp: new Date().toISOString(),
        };
      },
    }),
  },
});

// Router principal do Igniter integrado ao Next.js
export const BackofficeRouter = igniter.router({
  controllers: {
    api: apiController,
    dashboard: dashboardController,
  },
});

export type BackofficeRouter = typeof BackofficeRouter;
