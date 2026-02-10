export const typeDefs = `
  type User {
    id: ID!
    email: String!
    name: String!
    createdAt: String!
    transactions: [Transaction!]!
    categories: [Category!]!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Category {
    id: ID!
    name: String!
    color: String!
    icon: String!
    userId: String!
    createdAt: String!
    transactions: [Transaction!]!
  }

  type Transaction {
    id: ID!
    description: String
    amount: Float!
    type: String!
    date: String!
    createdAt: String!
    userId: String!
    categoryId: String!
    category: Category!
  }

  type Query {
    me: User
    categories: [Category!]!
    category(id: ID!): Category
    transactions: [Transaction!]!
    transaction(id: ID!): Transaction
  }

  type Mutation {
    signup(email: String!, password: String!, name: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    
    createCategory(name: String!, color: String, icon: String): Category!
    updateCategory(id: ID!, name: String, color: String, icon: String): Category!
    deleteCategory(id: ID!): Boolean!
    
    createTransaction(
      description: String
      amount: Float!
      type: String!
      date: String!
      categoryId: ID!
    ): Transaction!
    
    updateTransaction(
      id: ID!
      description: String
      amount: Float
      type: String
      date: String
      categoryId: String
    ): Transaction!
    
    deleteTransaction(id: ID!): Boolean!
  }
`;
