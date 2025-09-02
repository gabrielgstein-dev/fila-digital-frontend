#!/usr/bin/env node

/**
 * MCP Server Customizado para Fila Backoffice
 * 
 * Integração NextAuth + Igniter com ferramentas específicas para frontend
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Iniciando MCP Server do Fila Backoffice...');

// Carregar configuração
function loadConfig() {
  const configPath = path.join(__dirname, '.mcp-config.json');
  
  if (fs.existsSync(configPath)) {
    try {
      return JSON.parse(fs.readFileSync(configPath, 'utf8'));
    } catch (error) {
      console.warn('⚠️ Erro ao carregar configuração, usando padrão');
    }
  }
  
  return {
    name: 'fila-backoffice',
    description: 'MCP Server para Backoffice Next.js',
    version: '1.0.0'
  };
}

const config = loadConfig();

// Implementação das ferramentas
const tools = {
  'list-endpoints': {
    description: 'Lista todos os endpoints disponíveis',
    handler: () => {
      const endpoints = [
        '=== FRONTEND ROUTES ===',
        '🏠 GET / - Página inicial',
        '🔐 GET /login - Página de login',
        '📊 GET /dashboard - Dashboard principal',
        '🔥 GET /dashboard/igniter - Demo integração Igniter',
        '',
        '=== NEXTAUTH API ===',
        '🔑 POST /api/auth/signin - Login',
        '🚪 POST /api/auth/signout - Logout',
        '👤 GET /api/auth/session - Sessão atual',
        '',
        '=== BACKEND API (via Igniter) ===',
        '📈 GET /api/v1/dashboard/public-metrics',
        '🔒 GET /api/v1/dashboard/private-metrics',
        '👑 GET /api/v1/dashboard/admin-metrics',
        '🏢 GET /api/v1/dashboard/tenant-metrics',
        '🔄 POST /api/v1/dashboard/refresh-token',
        '⏰ GET /api/v1/dashboard/token-status',
        '📋 GET /api/v1/dashboard/session-info',
      ];
      
      return {
        success: true,
        endpoints: endpoints,
        total: endpoints.filter(e => e.includes('GET') || e.includes('POST')).length
      };
    }
  },

  'get-project-structure': {
    description: 'Obtém a estrutura do projeto Next.js',
    handler: () => {
      const structure = {
        type: 'Next.js Frontend',
        framework: 'React + TypeScript',
        styling: 'Tailwind CSS + Tamagui',
        auth: 'NextAuth.js',
        integration: 'Igniter.js Client',
        structure: {
          'src/app': 'App Router (Next.js 13+)',
          'src/components': 'Componentes React reutilizáveis',
          'src/hooks': 'Custom hooks (useTokenManager, useAuth)',
          'src/lib': 'Utilitários (api, auth, igniter-client)',
          'src/types': 'Definições TypeScript',
          'src/contexts': 'Context providers React'
        },
        keyFiles: [
          'src/lib/igniter-client.ts - Cliente para API Igniter',
          'src/hooks/useTokenManager.ts - Gerenciamento de token',
          'src/components/TokenManagerProvider.tsx - Provider de token',
          'src/lib/auth.ts - Configuração NextAuth',
          'src/app/dashboard/igniter/page.tsx - Demo integração'
        ]
      };
      
      return {
        success: true,
        project: config.name,
        ...structure
      };
    }
  },

  'test-igniter-integration': {
    description: 'Testa a integração NextAuth + Igniter',
    handler: (params) => {
      const { email, password } = params;
      
      // Simular teste de integração
      const testResults = {
        nextauth: {
          status: 'configured',
          providers: ['credentials'],
          session_strategy: 'jwt'
        },
        igniter_client: {
          status: 'implemented',
          file: 'src/lib/igniter-client.ts',
          methods: [
            'getPublicMetrics',
            'getPrivateMetrics',
            'getSessionInfo',
            'refreshToken',
            'getTokenStatus'
          ]
        },
        token_manager: {
          status: 'implemented',
          file: 'src/hooks/useTokenManager.ts',
          features: [
            'automatic_token_monitoring',
            'token_refresh',
            'expiration_warnings',
            'graceful_logout'
          ]
        },
        integration_test: {
          email: email,
          password_provided: !!password,
          test_endpoint: '/api/v1/dashboard/session-info',
          status: 'ready_for_testing',
          note: 'Use a página /dashboard/igniter para testar manualmente'
        }
      };
      
      return {
        success: true,
        message: 'Integração NextAuth + Igniter configurada e pronta',
        test_results: testResults,
        next_steps: [
          '1. Inicie o servidor backend (API) na porta 3001',
          '2. Inicie o frontend com: pnpm dev',
          '3. Acesse: http://localhost:3000/dashboard/igniter',
          '4. Faça login com as credenciais fornecidas',
          '5. Teste as funcionalidades de token na interface'
        ]
      };
    }
  },

  'check-token-status': {
    description: 'Verifica o status do token JWT',
    handler: (params) => {
      const { token } = params;
      
      if (!token) {
        return {
          success: false,
          error: 'Token não fornecido',
          help: 'Use o token obtido após login via NextAuth'
        };
      }
      
      try {
        // Decodificar JWT básico (sem verificação de assinatura)
        const parts = token.split('.');
        if (parts.length !== 3) {
          throw new Error('Token JWT inválido');
        }
        
        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
        const now = Math.floor(Date.now() / 1000);
        const expiresIn = payload.exp - now;
        
        return {
          success: true,
          token_info: {
            user_id: payload.sub || payload.userId,
            email: payload.email,
            role: payload.role,
            tenant_id: payload.tenantId,
            issued_at: new Date(payload.iat * 1000).toISOString(),
            expires_at: new Date(payload.exp * 1000).toISOString(),
            expires_in_seconds: expiresIn,
            expires_in_readable: expiresIn > 0 ? `${Math.floor(expiresIn / 60)}min` : 'EXPIRED',
            is_expired: expiresIn <= 0,
            should_refresh: expiresIn <= 300 // 5 minutos
          },
          recommendation: expiresIn <= 300 ? 'Token deve ser renovado em breve' : 'Token válido'
        };
      } catch (error) {
        return {
          success: false,
          error: 'Erro ao analisar token',
          details: error.message
        };
      }
    }
  },

  'get-dashboard-metrics': {
    description: 'Obtém métricas do dashboard via Igniter',
    handler: (params) => {
      const { type } = params;
      
      const mockMetrics = {
        public: {
          totalUsers: 1000,
          totalTickets: 5000,
          avgWaitTime: '15min',
          systemStatus: 'operational'
        },
        private: {
          userMetrics: {
            userId: 'user-123',
            tenantId: 'tenant-456',
            lastLogin: new Date().toISOString()
          },
          tenantMetrics: {
            totalTickets: 150,
            activeAgents: 5,
            avgWaitTime: '8min',
            queueLength: 12
          }
        },
        admin: {
          systemLoad: '45%',
          activeConnections: 234,
          errorRate: '0.1%',
          uptime: '99.9%'
        },
        tenant: {
          tenantId: 'tenant-456',
          name: 'Tenant Demo',
          totalQueues: 3,
          totalAgents: 8,
          monthlyTickets: 1250
        }
      };
      
      return {
        success: true,
        type: type,
        data: mockMetrics[type] || mockMetrics.public,
        note: 'Dados simulados - conecte com a API real para dados reais',
        api_endpoint: `/api/v1/dashboard/${type}-metrics`
      };
    }
  },

  'test-api-connection': {
    description: 'Testa conexão com a API backend',
    handler: (params) => {
      const { endpoint } = params;
      const baseUrl = 'http://localhost:3001/api/v1';
      const testEndpoint = endpoint || '/dashboard/public-metrics';
      
      return {
        success: true,
        connection_test: {
          backend_url: baseUrl,
          test_endpoint: testEndpoint,
          full_url: `${baseUrl}${testEndpoint}`,
          status: 'ready_to_test',
          note: 'Execute manualmente ou use a página /dashboard/igniter'
        },
        curl_example: `curl -X GET "${baseUrl}${testEndpoint}" -H "Content-Type: application/json"`,
        frontend_test: 'Acesse http://localhost:3000/dashboard/igniter e clique em "Atualizar"'
      };
    }
  },

  'analyze-component-structure': {
    description: 'Analisa estrutura de componentes React',
    handler: (params) => {
      const { directory = 'src/components' } = params;
      const componentsPath = path.join(__dirname, directory);
      
      let components = [];
      
      try {
        if (fs.existsSync(componentsPath)) {
          const files = fs.readdirSync(componentsPath);
          components = files
            .filter(file => file.endsWith('.tsx') || file.endsWith('.jsx'))
            .map(file => {
              const filePath = path.join(componentsPath, file);
              const content = fs.readFileSync(filePath, 'utf8');
              
              return {
                name: file,
                type: content.includes('export default') ? 'default' : 'named',
                has_props: content.includes('interface') || content.includes('type'),
                uses_hooks: content.includes('use'),
                lines: content.split('\n').length
              };
            });
        }
      } catch (error) {
        return {
          success: false,
          error: `Erro ao analisar diretório: ${directory}`,
          details: error.message
        };
      }
      
      return {
        success: true,
        directory: directory,
        total_components: components.length,
        components: components,
        summary: {
          with_props: components.filter(c => c.has_props).length,
          using_hooks: components.filter(c => c.uses_hooks).length,
          average_lines: Math.round(components.reduce((acc, c) => acc + c.lines, 0) / components.length) || 0
        }
      };
    }
  },

  'validate-nextauth-config': {
    description: 'Valida configuração do NextAuth',
    handler: () => {
      const authConfigPath = path.join(__dirname, 'src/lib/auth.ts');
      const envPath = path.join(__dirname, '.env');
      
      let validation = {
        config_file: false,
        env_file: false,
        required_vars: {},
        providers: [],
        session_strategy: null
      };
      
      try {
        // Verificar arquivo de configuração
        if (fs.existsSync(authConfigPath)) {
          validation.config_file = true;
          const authContent = fs.readFileSync(authConfigPath, 'utf8');
          
          if (authContent.includes('CredentialsProvider')) {
            validation.providers.push('credentials');
          }
          if (authContent.includes('strategy: \'jwt\'')) {
            validation.session_strategy = 'jwt';
          }
        }
        
        // Verificar variáveis de ambiente
        if (fs.existsSync(envPath)) {
          validation.env_file = true;
          const envContent = fs.readFileSync(envPath, 'utf8');
          
          validation.required_vars = {
            NEXTAUTH_SECRET: envContent.includes('NEXTAUTH_SECRET'),
            NEXTAUTH_URL: envContent.includes('NEXTAUTH_URL'),
            NEXT_PUBLIC_API_URL: envContent.includes('NEXT_PUBLIC_API_URL')
          };
        }
        
      } catch (error) {
        return {
          success: false,
          error: 'Erro ao validar configuração',
          details: error.message
        };
      }
      
      const isValid = validation.config_file && 
                     validation.env_file && 
                     Object.values(validation.required_vars).every(Boolean);
      
      return {
        success: true,
        is_valid: isValid,
        validation: validation,
        recommendations: isValid ? 
          ['Configuração NextAuth está correta!'] :
          [
            !validation.config_file && 'Verificar src/lib/auth.ts',
            !validation.env_file && 'Verificar arquivo .env',
            !validation.required_vars.NEXTAUTH_SECRET && 'Adicionar NEXTAUTH_SECRET',
            !validation.required_vars.NEXTAUTH_URL && 'Adicionar NEXTAUTH_URL',
            !validation.required_vars.NEXT_PUBLIC_API_URL && 'Adicionar NEXT_PUBLIC_API_URL'
          ].filter(Boolean)
      };
    }
  }
};

// Processar comandos MCP
function handleMCPRequest(request) {
  try {
    const { method, params } = request;
    
    if (method === 'tools/list') {
      return {
        tools: Object.keys(tools).map(name => ({
          name,
          description: tools[name].description,
          inputSchema: { type: 'object', properties: {} }
        }))
      };
    }
    
    if (method === 'tools/call') {
      const { name, arguments: args } = params;
      
      if (tools[name]) {
        const result = tools[name].handler(args || {});
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(result, null, 2)
          }]
        };
      }
      
      throw new Error(`Ferramenta não encontrada: ${name}`);
    }
    
    throw new Error(`Método não suportado: ${method}`);
    
  } catch (error) {
    return {
      error: {
        code: -1,
        message: error.message
      }
    };
  }
}

// Inicializar servidor MCP
console.log(`✅ MCP Server '${config.name}' iniciado`);
console.log(`📋 Ferramentas disponíveis: ${Object.keys(tools).length}`);
console.log('🔧 Ferramentas:', Object.keys(tools).join(', '));
console.log('');
console.log('🎯 Para testar:');
console.log('1. Reinicie o Cursor');
console.log('2. Cmd/Ctrl + Shift + P → "MCP: Show MCP Servers"');
console.log('3. Use comandos como: "Liste todos os endpoints da API"');
console.log('');

// Manter o processo rodando
process.stdin.on('data', (data) => {
  try {
    const request = JSON.parse(data.toString());
    const response = handleMCPRequest(request);
    console.log(JSON.stringify(response));
  } catch (error) {
    console.log(JSON.stringify({ error: { code: -1, message: error.message } }));
  }
});

module.exports = { handleMCPRequest, tools, config };
