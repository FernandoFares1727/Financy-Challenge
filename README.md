# Financy - Gestor de Finanças Pessoais

Um aplicativo **full-stack** moderno para gerenciar finanças pessoais com uma **API GraphQL** no backend e um **frontend React** responsivo.

## 🎯 Sobre o Projeto

Financy é um sistema completo para controlar receitas, despesas e categorias financeiras, permitindo que você tenha visibilidade total das suas finanças pessoais.

## 📁 Estrutura do Projeto

Este é um **monorepo** com dois **projetos independentes**:

```
financy/
├── server/                 # Backend - Apollo GraphQL Server
│   ├── src/
│   │   ├── index.ts        # Entrada da aplicação
│   │   ├── auth.ts         # Lógica de autenticação
│   │   ├── schema.ts       # Schema GraphQL
│   │   ├── resolvers.ts    # Resolvers GraphQL
│   │   └── types.ts        # Tipos TypeScript
│   ├── prisma/
│   │   ├── schema.prisma   # Schema do banco de dados
│   │   └── migrations/     # Histórico de migrações
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── web/                    # Frontend - React + Vite
│   ├── src/
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── hooks/          # Custom React hooks (lógica de negócio)
│   │   ├── graphql/        # Configuração e queries GraphQL
│   │   ├── utils/          # Funções utilitárias
│   │   ├── types.ts        # Tipos TypeScript
│   │   ├── App.tsx         # Componente principal
│   │   └── index.tsx       # Entrada da aplicação
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   └── README.md
│
└── README.md               # Este arquivo
```

## 🚀 Início Rápido

### Pré-requisitos

- **Node.js** 18+
- **npm** ou **yarn**

### 1. Clonar o Repositório

```bash
git clone <seu-repositorio>
cd financy
```

### 2. Instalar Dependências

**Backend (Server):**
```bash
cd server
npm install
```

**Frontend (Web):**
```bash
cd ../web
npm install
```

### 3. Configurar Variáveis de Ambiente

**Server** - Criar arquivo `server/.env.local`:
```env
JWT_SECRET=sua-chave-secreta-aqui
DATABASE_URL=file:./dev.db
PORT=4000
```

**Web** - Criar arquivo `web/.env.local`:
```env
VITE_API_URL=http://localhost:4000/graphql
```

### 4. Iniciar Desenvolvimento

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
O servidor estará disponível em: `http://localhost:4000/graphql`

**Terminal 2 - Frontend:**
```bash
cd web
npm run dev
```
A aplicação estará disponível em: `http://localhost:5173`

## 📚 Documentação Detalhada

- [Server README](./server/README.md) - Documentação do backend
- [Web README](./web/README.md) - Documentação do frontend

## 🛠️ Stack Tecnológico

### Backend
- **Apollo Server Express** - Framework GraphQL
- **Prisma** - ORM para banco de dados
- **SQLite** - Banco de dados
- **Express** - Servidor web
- **JWT** - Autenticação
- **bcrypt** - Criptografia de senhas
- **TypeScript** - Tipagem estática

### Frontend
- **React 19** - Biblioteca UI
- **Vite** - Build tool
- **TypeScript** - Tipagem estática
- **GraphQL Request** - Cliente GraphQL
- **React Icons** - Ícones
- **Tailwind CSS** - Estilização

## 📝 Scripts Disponíveis

### Server
```bash
npm run dev       # Inicia desenvolvimento com hot reload
npm run build     # Constrói a aplicação
npm start         # Inicia servidor de produção
npm run migrate   # Executa migrações do banco de dados
npm run db:push   # Sincroniza schema com banco
npm run db:reset  # Reseta banco (cuidado!)
npm run studio    # Abre Prisma Studio
```

### Web
```bash
npm run dev       # Inicia servidor de desenvolvimento
npm run build     # Constrói para produção
npm run preview   # Visualiza build de produção
```

## 🗄️ Modelo de Dados

### Entidades Principais
- **User** - Usuário da aplicação
- **Category** - Categorias para transações
- **Transaction** - Receitas e despesas

## 🔐 Autenticação

O sistema utiliza **JWT (JSON Web Tokens)** para autenticação. As senhas são criptografadas com **bcrypt**.

## 📱 Funcionalidades

- ✅ Autenticação de usuários
- ✅ Gerencimento de categorias
- ✅ Registro de transações (receitas e despesas)
- ✅ Dashboard com resumo financeiro
- ✅ Visualização e edição de transações
- ✅ Interface responsiva

## 🤝 Contribuindo

Sinta-se livre para fazer fork, criar branches e submeter pull requests com melhorias!
- **Node.js 18+**
- **npm** ou **yarn**

### Passo 1: Setup do Servidor

```bash
cd server
npm install
npm run migrate    # Configurar banco de dados
npm run dev        # Iniciar servidor GraphQL
```

O servidor rodará em: **http://localhost:4000/graphql**

### Passo 2: Setup do Frontend (em outro terminal)

```bash
cd web
npm install
npm run dev        # Iniciar aplicação React
```

Frontend rodará em: **http://localhost:5173**

---

## 📚 Documentação

Cada projeto tem sua própria documentação:

- **[Documentação do Servidor](./server/README.md)** → API GraphQL, banco de dados, setup backend
- **[Documentação do Frontend](./web/README.md)** → Frontend, componentes, setup React

---

## 🔧 Comandos de Desenvolvimento

### Comandos do Servidor
```bash
cd server
npm run dev        # Iniciar servidor em desenvolvimento
npm run build      # Build para produção
npm start          # Rodar build de produção
npm run migrate    # Criar/atualizar migrações
npm run db:reset   # Reset do banco (dev only)
npm run studio     # Abrir Prisma Studio
```

### Comandos do Frontend
```bash
cd web
npm run dev        # Iniciar servidor em desenvolvimento
npm run build      # Build para produção
npm run preview    # Preview do build
```

---

## 🎯 Funcionalidades

✅ **Autenticação** - Registro/Login com JWT
✅ **Transações** - CRUD de transações
✅ **Categorias** - Organizar transações por categoria
✅ **API GraphQL** - Queries e mutations type-safe
✅ **Prisma ORM** - Gerenciar banco de dados
✅ **SQLite** - Banco de dados em desenvolvimento
✅ **Isolamento por Usuário** - Multi-tenant safe
✅ **Interface Responsiva** - Tailwind CSS

---

## 🛠 Stack Tecnológico

### Frontend
- React 19
- Vite
- TypeScript
- Tailwind CSS
- graphql-request

### Backend
- Node.js
- Express.js
- Apollo Server
- GraphQL
- Prisma ORM
- SQLite (dev) / PostgreSQL (produção)
- JWT Authentication
- bcrypt

---

## 🔐 Variáveis de Ambiente

### Server (.env.local)
```env
JWT_SECRET=your-random-secret-key
DATABASE_URL=file:./dev.db
PORT=4000
```

### Web (.env.local)
```env
VITE_API_URL=http://localhost:4000/graphql
```

---

## 📖 Fluxo de Trabalho

1. **Desenvolvimento**
   - Servidor: `cd server && npm run dev`
   - Frontend: `cd web && npm run dev`
   - Projetos são independentes

2. **Mudanças no Banco**
   - Editar: `server/prisma/schema.prisma`
   - Executar: `npm run migrate`

3. **Build**
   - Server: `cd server && npm run build`
   - Web: `cd web && npm run build`

4. **Deploy**
   - Server e web são deployados independentemente

---

## 🌐 Documentação da API

GraphQL Playground: **http://localhost:4000/graphql**

### Autenticação
```graphql
mutation Signup {
  signup(email: "user@example.com", password: "pass", name: "User") {
    token
    user { id email name }
  }
}

mutation Login {
  login(email: "user@example.com", password: "pass") {
    token
    user { id email name }
  }
}
```

Documentação completa em **[Server README](./server/README.md)**

---

## ⚠️ Notas Importantes

### Desenvolvimento
- Cada projeto tem seu próprio `package.json`
- Projetos são deployados independentemente
- Banco é SQLite (desenvolvimento apenas)

### Produção
- Mude `JWT_SECRET` para um valor seguro
- Use PostgreSQL ao invés de SQLite
- Ative HTTPS/TLS
- Configure CORS adequadamente
- Use gerenciador de variáveis de ambiente
- Valide inputs

---

## 📄 Licença

MIT

---

## 🤝 Contribuindo

Cada projeto é independente:
- Backend: veja [Server README](./server/README.md)
- Frontend: veja [Web README](./web/README.md)
- Instale dependencies no diretório respectivo
