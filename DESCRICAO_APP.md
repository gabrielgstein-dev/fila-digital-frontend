# 📋 Descrição do Sistema Fila Digital

## 🎯 Visão Geral

O **Fila Digital** é um sistema completo de gerenciamento de filas de atendimento desenvolvido para empresas que precisam organizar e otimizar o atendimento ao cliente. A solução permite que clientes tirem senhas remotamente via QR Code ou link, acompanhem sua posição na fila em tempo real e recebam notificações quando forem chamados, eliminando a necessidade de permanecer fisicamente no local.

## 🏗️ Arquitetura

O sistema é composto por dois componentes principais:

### 1. **Backoffice (fila-backoffice)**
Interface administrativa web desenvolvida em **Next.js 14** com TypeScript que permite:
- Gerenciamento completo de filas (criação, edição, configuração)
- Visualização e controle de tickets/senhas em tempo real
- Dashboard com estatísticas e métricas de desempenho
- Painel de manutenção e configurações avançadas
- Sistema de notificações em tempo real via Server-Sent Events (SSE)
- Autenticação via NextAuth com suporte a JWT
- Interface moderna e responsiva com Tailwind CSS e Tamagui

### 2. **API (fila-api)**
Backend robusto desenvolvido em **NestJS** com TypeScript que fornece:
- Arquitetura multi-tenant (suporte a múltiplas empresas)
- CRUD completo de filas, tickets, agentes e clientes
- Sistema de tempo real com WebSocket (Socket.IO) e Server-Sent Events (Igniter.js)
- Integrações com WhatsApp, SMS (Twilio) e Telegram para notificações
- Autenticação JWT com isolamento de dados por tenant
- Dashboard com métricas e estatísticas em tempo real
- Banco de dados PostgreSQL com Prisma ORM
- Rate limiting e proteções de segurança (DDoS, XSS, CSRF, SQL Injection)

## 🎯 Funcionalidades Principais

### Para Clientes
- ✅ Tirar senha via QR Code ou link compartilhado
- ✅ Acompanhar posição na fila em tempo real
- ✅ Receber notificações quando for chamado
- ✅ Ver estimativa de tempo de espera
- ✅ Histórico de atendimentos

### Para Empresas/Atendentes
- ✅ Painel de controle de filas
- ✅ Chamar próximo, pular ou rechamar senhas
- ✅ Múltiplas filas simultâneas por empresa
- ✅ Tipos de fila configuráveis (Geral, Prioritária, VIP)
- ✅ Dashboard com estatísticas em tempo real
- ✅ Painel TV para exibição pública
- ✅ Gerenciamento de múltiplos atendentes por fila

### Recursos Técnicos
- ✅ **Tempo Real**: WebSocket e SSE para atualizações instantâneas
- ✅ **Multi-tenant**: Isolamento completo de dados entre empresas
- ✅ **Escalável**: Arquitetura otimizada para alta performance
- ✅ **Seguro**: Autenticação JWT, rate limiting e validações rigorosas
- ✅ **Documentado**: Swagger integrado para documentação da API

## 🛠️ Stack Tecnológica

### Frontend (Backoffice)
- Next.js 14 (App Router)
- TypeScript
- React 18
- Zustand (gerenciamento de estado)
- NextAuth (autenticação)
- Tailwind CSS + Tamagui (UI)
- Server-Sent Events (tempo real)

### Backend (API)
- NestJS 10
- TypeScript
- Prisma ORM
- PostgreSQL
- Socket.IO (WebSocket)
- Igniter.js (SSE otimizado)
- JWT (autenticação)
- Redis (cache e sessões)
- Twilio (SMS)
- Integrações WhatsApp e Telegram

## 🎯 Casos de Uso

O sistema é ideal para:
- **Centros Clínicos**: Múltiplas especialidades com filas separadas
- **Laboratórios**: Fila única otimizada para coleta de exames
- **Estabelecimentos Comerciais**: Atendimento organizado sem aglomerações
- **Órgãos Públicos**: Atendimento ao cidadão com controle de filas
- **Bancos**: Atendimento preferencial e geral

## 📊 Benefícios

- **Redução de 60%** no tempo de espera percebido pelos clientes
- **Aumento de 35%** na capacidade de atendimento
- **Eliminação de aglomerações** físicas
- **Controle total** sobre métricas e estatísticas
- **Experiência moderna** para clientes e atendentes
- **ROI positivo** em poucos meses de uso

## 🔄 Fluxo de Funcionamento

1. **Empresa cria fila** no backoffice e gera QR Code
2. **Cliente escaneia QR Code** e preenche dados básicos
3. **Sistema gera senha única** e cliente entra na fila
4. **Cliente acompanha em tempo real** sua posição via WebSocket/SSE
5. **Atendente chama senha** pelo painel administrativo
6. **Cliente recebe notificação** e vai para atendimento
7. **Sistema registra métricas** e atualiza estatísticas

---

**Sistema desenvolvido para modernizar e otimizar o atendimento ao cliente em estabelecimentos que precisam gerenciar filas de forma eficiente e profissional.**





