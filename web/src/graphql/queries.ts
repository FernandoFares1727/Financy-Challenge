import { gql } from 'graphql-request';

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        name
      }
    }
  }
`;

export const SIGNUP_MUTATION = gql`
  mutation Signup($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name) {
      token
      user {
        id
        email
        name
      }
    }
  }
`;

export const GET_ME_QUERY = gql`
  query GetMe {
    me {
      id
      email
      name
    }
  }
`;

export const GET_CATEGORIES_QUERY = gql`
  query GetCategories {
    categories {
      id
      name
      color
      icon
      userId
      createdAt
      transactions {
        id
      }
    }
  }
`;

export const GET_CATEGORY_QUERY = gql`
  query GetCategory($id: ID!) {
    category(id: $id) {
      id
      name
      userId
      createdAt
      transactions {
        id
        amount
        type
        date
      }
    }
  }
`;

export const CREATE_CATEGORY_MUTATION = gql`
  mutation CreateCategory($name: String!, $color: String, $icon: String) {
    createCategory(name: $name, color: $color, icon: $icon) {
      id
      name
      color
      icon
      userId
      createdAt
      transactions {
        id
      }
    }
  }
`;

export const UPDATE_CATEGORY_MUTATION = gql`
  mutation UpdateCategory($id: ID!, $name: String, $color: String, $icon: String) {
    updateCategory(id: $id, name: $name, color: $color, icon: $icon) {
      id
      name
      color
      icon
      userId
      createdAt
      transactions {
        id
      }
    }
  }
`;

export const DELETE_CATEGORY_MUTATION = gql`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id)
  }
`;

export const GET_TRANSACTIONS_QUERY = gql`
  query GetTransactions {
    transactions {
      id
      description
      amount
      type
      date
      createdAt
      categoryId
      category {
        id
        name
      }
    }
  }
`;

export const GET_TRANSACTION_QUERY = gql`
  query GetTransaction($id: ID!) {
    transaction(id: $id) {
      id
      description
      amount
      type
      date
      createdAt
      categoryId
      category {
        id
        name
      }
    }
  }
`;

export const CREATE_TRANSACTION_MUTATION = gql`
  mutation CreateTransaction(
    $description: String
    $amount: Float!
    $type: String!
    $date: String!
    $categoryId: ID!
  ) {
    createTransaction(
      description: $description
      amount: $amount
      type: $type
      date: $date
      categoryId: $categoryId
    ) {
      id
      description
      amount
      type
      date
      createdAt
      categoryId
      category {
        id
        name
      }
    }
  }
`;

export const UPDATE_TRANSACTION_MUTATION = gql`
  mutation UpdateTransaction(
    $id: ID!
    $description: String
    $amount: Float
    $type: String
    $date: String
    $categoryId: String
  ) {
    updateTransaction(
      id: $id
      description: $description
      amount: $amount
      type: $type
      date: $date
      categoryId: $categoryId
    ) {
      id
      description
      amount
      type
      date
      createdAt
      categoryId
      category {
        id
        name
      }
    }
  }
`;

export const DELETE_TRANSACTION_MUTATION = gql`
  mutation DeleteTransaction($id: ID!) {
    deleteTransaction(id: $id)
  }
`;
