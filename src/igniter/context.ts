import { createBackofficeContext } from './context';

// Contexto específico para o backoffice
export const createBackofficeContext = () => {
  return {
    // Configurações do backoffice
    config: {
      apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
      authSecret: process.env.NEXTAUTH_SECRET,
      googleClientId: process.env.GOOGLE_CLIENT_ID,
    },
    
    // Serviços específicos do backoffice
    services: {
      // Aqui você pode adicionar serviços específicos
    }
  };
};

export type BackofficeContext = ReturnType<typeof createBackofficeContext>;
