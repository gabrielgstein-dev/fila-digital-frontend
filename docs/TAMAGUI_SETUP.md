# Sistema de Temas com Tailwind CSS

Este projeto foi configurado com um sistema de temas claro e escuro usando Tailwind CSS, com suporte a componentes adaptativos.

## Funcionalidades Implementadas

- **Sistema de Temas**: Suporte completo a temas claro e escuro
- **Contexto React**: `ThemeContext` para gerenciar o estado do tema
- **Componente de Toggle**: `ThemeToggle` para alternar entre temas
- **CSS Adaptativo**: Variáveis CSS que se adaptam ao tema
- **Tailwind CSS**: Configurado para suporte ao modo escuro
- **Persistência**: O tema escolhido é salvo no localStorage

## Estrutura de Arquivos

### `src/contexts/ThemeContext.tsx`
Contexto React para gerenciar temas claro e escuro, com persistência no localStorage.

### `src/components/ThemeToggle.tsx`
Componente para alternar entre temas com ícones do Lucide React.

### `src/components/TamaguiExample.tsx`
Exemplo de componente com tema adaptativo usando Tailwind CSS.

## Como Usar

### 1. Usar o Contexto de Tema

```tsx
import { useTheme } from '../contexts/ThemeContext'

function MeuComponente() {
  const { theme, toggleTheme, setTheme } = useTheme()
  
  return (
    <div>
      <p>Tema atual: {theme}</p>
      <button onClick={toggleTheme}>Alternar Tema</button>
      <button onClick={() => setTheme('dark')}>Tema Escuro</button>
    </div>
  )
}
```

### 2. Classes CSS para Temas

O projeto usa Tailwind CSS com suporte a modo escuro:

```tsx
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  Conteúdo com tema adaptativo
</div>
```

### 3. Variáveis CSS Personalizadas

```tsx
<button className="bg-primary-600 hover:bg-primary-700">
  Botão com cor primária
</button>
```

## Temas Disponíveis

- **Claro**: Cores claras com texto escuro
- **Escuro**: Cores escuras com texto claro

## Variáveis CSS

O projeto define variáveis CSS para cores primárias que se adaptam ao tema:

```css
:root {
  --primary-50: #eff6ff;
  --primary-100: #dbeafe;
  --primary-600: #2563eb;
  --primary-700: #1d4ed8;
}

.dark {
  --primary-50: #0f172a;
  --primary-100: #1e293b;
  --primary-600: #3b82f6;
  --primary-700: #2563eb;
}
```

## Configuração do Tailwind

O Tailwind está configurado para usar classes `dark:` para modo escuro:

```ts
darkMode: 'class'
```

## Exemplo de Uso

```tsx
// Componente com tema adaptativo
<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
    Título
  </h2>
  <p className="text-gray-600 dark:text-gray-300">
    Conteúdo do componente
  </p>
  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
    Ação
  </button>
</div>
```

## Próximos Passos

1. Criar mais componentes com tema adaptativo
2. Implementar animações de transição entre temas
3. Personalizar paleta de cores
4. Adicionar mais variáveis CSS para componentes específicos
5. Implementar temas customizados (ex: azul, verde, etc.)
