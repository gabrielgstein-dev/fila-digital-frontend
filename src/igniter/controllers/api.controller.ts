import { igniter } from '../router';

export const apiController = igniter.controller({
  path: '/api',
  actions: {
    health: igniter.query({
      path: '/health',
      handler: async () => {
        return {
          status: 'ok',
          timestamp: new Date().toISOString(),
          service: 'fila-backoffice',
        };
      },
    }),
  },
});
