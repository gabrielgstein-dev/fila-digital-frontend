import { BackofficeRouter } from './router';
import { createServer } from 'http';

async function bootstrap() {
  console.log('🚀 Iniciando servidor Igniter.js para Backoffice...');
  
  const port = process.env.IGNITER_PORT || 3001;
  
  createServer(async (req, res) => {
    try {
      const request = new Request(`http://${req.headers.host}${req.url}`, {
        method: req.method,
        headers: req.headers as any,
      });

      const response = await BackofficeRouter.handler(request);

      res.statusCode = response.status;
      for (const [key, value] of response.headers.entries()) {
        res.setHeader(key, value);
      }
      res.end(await response.text());
    } catch (error) {
      console.error('❌ Erro ao processar requisição:', error);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  }).listen(Number(port), () => {
    console.log(`✅ Servidor Igniter.js rodando em http://localhost:${port}`);
  });
}

bootstrap().catch(console.error);
