# Financy Server - API GraphQL

Servidor Apollo GraphQL para gerenciar finanças pessoais usando Prisma e SQLite.

## 🎯 Sobre

Este servidor fornece uma API GraphQL completa para gerenciar usuários, transações e categorias fin anceiras. Implementa autenticação JWT e criptografia de senhas com bcrypt.

## 🚀 Início Rápido

### Pré-requisitos
- **Node.js** 18+
- **npm** ou **yarn**

### Instalação

```bash
npm install
```

### Configurar Banco de Dados

Criar arquivo `.env.local` com:

```env
JWT_SECRET=sua-chave-secreta-aqui
DATABASE_URL=file:./dev.db
PORT=4000
```

Executar migrações:

```bash
npm run migrate
```

### Desenvolvimento

```bash
npm run dev
```

O servidor GraphQL estará disponível em: **`http://localhost:4000/graphql`**

### Construir para Produção

```bash
npm run build
```

### Iniciar Servidor de Produção

```bash
npm start
```

## 📝 Scripts Disponíveis

```bash
npm run dev        # Inicia com hot reload (tsx watch)
npm run build      # Compila TypeScript
npm start          # Inicia servidor compilado
npm run migrate    # Executa migrações do banco
npm run db:push    # Sincroniza schema com banco (sem criar migração)
npm run db:reset   # Reseta banco (cuidado!)
npm run studio     # Abre Prisma Studio (GUI)
```

## 🏗️ Estrutura do Projeto

```
src/
├── index.ts        # Configuração do servidor Express e Apollo
├── auth.ts         # Lógica de autenticação JWT
├── schema.ts       # Definição do schema GraphQL
├── resolvers.ts    # Implementação dos resolvers
└── types.ts        # Tipos TypeScript compartilhados

prisma/
├── schema.prisma   # Schema do banco de dados
└── migrations/     # Histórico de migrações
```

## 🗄️ Variáveis de Ambiente

**Obrigatórias:**
```env
JWT_SECRET=chave-para-assinar-tokens-jwt
DATABASE_URL=caminho-ou-url-do-banco
PORT=4000
```

## 📦 Dependências Principais

### Produção
- **apollo-server-express** - Servidor GraphQL
- **express** - Framework web
- **graphql** - Implementação GraphQL
- **prisma** - ORM e gerenciador de banco
- **jsonwebtoken** - Autenticação JWT
- **bcrypt** - Hash de senhas
- **cors** - CORS middleware

### Desenvolvimento
- **typescript** - Linguagem com tipos
- **tsx** - Executor TypeScript com watch mode
- **@types/** - Tipos para bibliotecas

## 🔐 Autenticação

O servidor usa **JWT (JSON Web Tokens)** para autenticação:

- Tokens são gerados no login/signup
- Enviados no header `Authorization: Bearer <token>`
- Verificados em cada requisição autenticada
- Senhas são criptografadas com **bcrypt**

## 📡 Endpoints GraphQL

Acesse `http://localhost:4000/graphql` para explorar a API com GraphQL Playground.

### Queries Principais
- `me` - Dados do usuário autenticado
- `categories` - Lista de categorias
- `transactions` - Lista de transações

### Mutations Principais
- `login` - Autenticar usuário
- `signup` - Criar nova conta
- `createCategory` - Nova categoria
- `createTransaction` - Nova transação
- E mais...

## 💾 Banco de Dados

### Entidades
- **User** - Usuários da aplicação
- **Category** - Categorias de transações
- **Transaction** - Receitas e despesas

## 📚 Prisma Studio

Para visualizar e gerenciar dados via GUI:

```bash
npm run studio
```

Abre em `http://localhost:5555`

## 🔄 Fluxo de Desenvolvimento

1. Modificar `prisma/schema.prisma`
2. Executar `npm run migrate` para criar migração
3. Atualizar `schema.ts` (schema GraphQL)
4. Atualizar `resolvers.ts` com a lógica
5. Testar em `http://localhost:4000/graphql`

## Database Management

```bash
# Create a new migration
npm run migrate

# Reset the database (development only)
npm run db:reset

# Open Prisma Studio to view data
npm run studio
```

## Project Structure

```
src/
├── index.ts         # Server entry point
├── auth.ts          # JWT and password utilities
├── schema.ts        # GraphQL type definitions
├── resolvers.ts     # GraphQL resolvers
├── types.ts         # TypeScript types
└── tsconfig.json

prisma/
├── schema.prisma    # Database schema
└── migrations/      # Database migrations
```

## API Documentation

### Authentication

**Signup**
```graphql
mutation Signup($email: String!, $password: String!, $name: String!) {
  signup(email: $email, password: $password, name: $name) {
    token
    user { id email name }
  }
}
```

**Login**
```graphql
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
    user { id email name }
  }
}
```

### Transactions & Categories

Complete GraphQL schema available on the GraphQL playground at `/graphql`

## Features

- User authentication with JWT (7-day expiration)
- CRUD operations for transactions
- CRUD operations for categories
- Type-safe GraphQL API
- SQLite database with Prisma ORM
- Password hashing with bcrypt
- User data isolation (multi-tenant safe)

## Technologies

- Node.js
- Express.js
- Apollo Server
- GraphQL
- Prisma ORM
- SQLite
- TypeScript
- JWT (jsonwebtoken)
- bcrypt

## Security Notes

⚠️ **For Development Only**
- Change `JWT_SECRET` in production
- Use PostgreSQL instead of SQLite in production
- Enable HTTPS in production
- Implement rate limiting
- Add input validation

## License

MIT
