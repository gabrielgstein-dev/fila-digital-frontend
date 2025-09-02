import { Igniter } from '@igniter-js/core';
import { createBackofficeContext } from './context';

export const igniter = Igniter.context<BackofficeContext>().create();

export const BackofficeRouter = igniter.router({
  baseURL: process.env.IGNITER_BASE_URL || 'http://localhost:3001',
  basePATH: '/api/igniter',
  controllers: {
    // Controladores serão adicionados aqui
  },
});

export type BackofficeRouter = typeof BackofficeRouter;
