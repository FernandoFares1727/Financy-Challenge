# Financy Web - Frontend React

Aplicação React moderna para gerenciar finanças pessoais usando Vite e TypeScript.

## 🎯 Sobre

Interface responsiva e intuitiva para acessar a API GraphQL do Financy. Permite gerenciar transações, categorias e visualizar um dashboard com resumo financeiro.

## 🚀 Início Rápido

### Pré-requisitos
- **Node.js** 18+
- **npm** ou **yarn**
- **Servidor** rodando em `http://localhost:4000` (opcional, configurável)

### Instalação

```bash
npm install
```

### Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em: **`http://localhost:5173`**

### Construir para Produção

```bash
npm run build
```

Gera arquivos otimizados em `dist/`

### Visualizar Build de Produção

```bash
npm run preview
```

## 📝 Scripts Disponíveis

```bash
npm run dev       # Inicia servidor de desenvolvimento com HMR
npm run build     # Constrói para produção (Vite)
npm run preview   # Visualiza build gerado localmente
```

## 🔧 Configuração

### Variáveis de Ambiente

Criar arquivo `.env.local`:

```env
VITE_API_URL=http://localhost:4000/graphql
```

**Nota:** Variáveis devem começar com `VITE_` para serem acessadas no cliente.

## 🏗️ Estrutura do Projeto

```
src/
├── pages/          # Componentes de página
│   ├── Auth.tsx    # Login/Signup
│   ├── Dashboard.tsx
│   ├── Transactions.tsx
│   └── Categories.tsx
│
├── components/     # Componentes reutilizáveis
│   ├── Layout.tsx  # Layout principal
│   └── UI.tsx      # Componentes de UI (Modal, Button, Input)
│
├── hooks/          # Custom React hooks (lógica de negócio)
│   ├── useAuth.ts
│   ├── useTransactions.ts
│   ├── useCategories.ts
│   ├── useAppState.ts
│   ├── useErrorHandling.ts
│   └── index.ts
│
├── graphql/        # Configuração GraphQL
│   ├── client.ts   # Client GraphQL (graphql-request)
│   └── queries.ts  # Queries e Mutations
│
├── utils/          # Funções utilitárias
│   └── date.ts     # Funções de formatação de datas
│
├── types.ts        # Tipos TypeScript da aplicação
├── App.tsx         # Componente raiz
└── index.tsx       # Entrada da aplicação
```

## 🎨 Arquitetura e Padrões

### Hooks Customizados (Business Logic)

A lógica de negócio está isolada em hooks customizados na pasta `hooks/`:

- **`useAuth.ts`** - Gerencia autenticação e sessão
- **`useTransactions.ts`** - Gerencia estado e operações de transações
- **`useCategories.ts`** - Gerencia estado e operações de categorias
- **`useAppState.ts`** - Estado global da aplicação (abas)
- **`useErrorHandling.ts`** - Tradução e tratamento de erros

Isso torna o `App.tsx` mais limpo e a lógica mais reutilizável e testável.

### Componentes

- **Pages** (`pages/`) - Componentes de página/tela
- **UI Components** (`components/`) - Componentes reutilizáveis
- **Componentes controlados** com Tailwind CSS

## 📡 GraphQL Client

Usa **graphql-request** para comunicação com o servidor:

```typescript
import { graphqlClient } from './graphql/client';
import { LOGIN_MUTATION } from './graphql/queries';

// Executar query/mutation
const response = await graphqlClient.request(QUERY, variables);
```

## 🔐 Autenticação

- Token JWT armazenado em `localStorage`
- Enviado via header `Authorization` em cada requisição
- Logout limpa o token e estado do usuário

## 📱 Páginas e Funcionalidades

| Página | Funcionalidade |
|--------|----------------|
| **Auth** | Login e Signup |
| **Dashboard** | Resumo financeiro e últimas transações |
| **Transactions** | Lista completa de transações com filtros e edição |
| **Categories** | Gerenciar categorias com cores e ícones |

## 🎯 Estados e Modais

- **Modal de Transação** - Criar/editar transações
- **Modal de Categoria** - Criar/editar categorias
- **Abas** - Navegação entre pages
- **Autenticação** - Exibe Auth page sem usuário

## 🌈 Estilos

Usa **Tailwind CSS** para estilização:
- Classes utilitárias
- Responsividade integrada
- Temas de cores customizadas (`expense`, `revenue`, `brand`)

## 🚀 Deploy

### Build Otimizado
```bash
npm run build
```

### Em Produção
- Servir pasta `dist/` como conteúdo estático
- Configurar `VITE_API_URL` para apontar ao servidor
- CORS deve estar habilitado no servidor

## 📦 Dependências Principais

### Produção
- **react & react-dom** - UI library
- **graphql-request** - GraphQL client
- **graphql-tag** - Parsing GraphQL queries
- **react-icons** - Ícones SVG

### Desenvolvimento
- **vite** - Build tool rápido
- **typescript** - Tipagem estática
- **tailwindcss** - Framework CSS (se configurado)
- **@vitejs/plugin-react** - Plugin React para Vite

## 🔗 Conexão com o Backend

O cliente se conecta ao servidor via:

```typescript
// client.ts
const graphqlClient = new GraphQLClient(import.meta.env.VITE_API_URL)
```

Certifique-se que:
1. Servidor está rodando em `http://localhost:4000`
2. Variável `VITE_API_URL` está correta
3. CORS está habilitado no servidor

## 💡 Dicas de Desenvolvimento

- Use `npm run dev` para desenvolvimento com hot reload
- Graphql Playground no servidor ajuda a explorar a API
- Console do navegador mostra erros GraphQL
- LocalStorage pode ser inspecionado em DevTools
├── graphql/        # GraphQL client and queries
├── types.ts        # TypeScript types
├── App.tsx         # Root component
└── index.tsx       # Entry point
```

## Features

- User authentication with JWT
- Transaction management
- Category management
- GraphQL integration
- Responsive design with Tailwind CSS

## Technologies

- React 19
- Vite
- TypeScript
- Tailwind CSS
- GraphQL (graphql-request)

## License

MIT
