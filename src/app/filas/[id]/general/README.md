# General Tab - Componentes

Esta pasta contém a implementação da tab "Visão Geral" da página de detalhes da fila, dividida em componentes menores e mais focados.

## 📁 Estrutura

```
general/
├── GeneralTab.tsx          # Componente principal da tab
├── components/             # Componentes específicos
│   ├── QueueFlowDisplay.tsx    # Trem de senhas e fluxo
│   ├── QueueStats.tsx          # Estatísticas da fila
│   ├── QueueConfigCard.tsx     # Configurações da fila
│   ├── PerformanceCard.tsx     # Métricas de desempenho
│   └── index.ts               # Exports dos componentes
├── index.ts               # Export do GeneralTab
└── README.md             # Esta documentação
```

## 🧩 Componentes

### `GeneralTab.tsx`
Componente principal que organiza e renderiza todos os sub-componentes da visão geral.

**Props:**
- `queue: Queue` - Dados da fila
- `queueFlow: QueueFlow` - Dados do fluxo de atendimento
- `queueStats: QueueStats | null` - Estatísticas opcionais da fila

### `QueueFlowDisplay.tsx`
Exibe o trem de senhas com o fluxo de atendimento visual.

**Características:**
- Senha anterior (concluída)
- Senha atual (destaque principal)
- Próximas senhas na fila
- Tempo estimado restante

### `QueueStats.tsx`
Mostra as estatísticas principais da fila em cards.

**Métricas exibidas:**
- Pessoas aguardando
- Atendidos hoje
- Tempo médio de espera
- Taxa de conclusão

### `QueueConfigCard.tsx`
Apresenta as configurações da fila.

**Informações:**
- Descrição da fila
- Capacidade máxima
- Tolerância em minutos
- Tempo médio de atendimento

### `PerformanceCard.tsx`
Exibe métricas de desempenho e status da fila.

**Dados mostrados:**
- Horário de pico
- Status (ativa/inativa)
- Próxima estimativa
- Taxa de abandono (se disponível)
- Total processado hoje (se disponível)

## 🎯 Benefícios da Divisão

✅ **Responsabilidade única** - Cada componente tem uma função específica  
✅ **Reutilização** - Componentes podem ser usados independentemente  
✅ **Manutenibilidade** - Código mais fácil de entender e modificar  
✅ **Testabilidade** - Componentes menores são mais fáceis de testar  
✅ **Performance** - Possibilidade de otimizações específicas por componente  

## 🔄 Como usar

```tsx
import { GeneralTab } from './general'

// Ou importar componentes específicos
import { QueueFlowDisplay, QueueStats } from './general/components'
```
