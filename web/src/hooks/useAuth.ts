import { useState, useCallback } from 'react';
import { User } from '../types';
import { graphqlClient } from '../graphql/client';
import { LOGIN_MUTATION, SIGNUP_MUTATION, GET_ME_QUERY } from '../graphql/queries';
import { useErrorHandling } from './useErrorHandling';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { getFriendlyError } = useErrorHandling();

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        graphqlClient.setHeader('authorization', `Bearer ${token}`);
        const response = await graphqlClient.request(GET_ME_QUERY) as { me: User };
        if (response.me) {
          setUser(response.me);
        }
      } catch (error) {
        localStorage.removeItem('token');
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = useCallback(async (email: string, password: string) => {
    try {
      const response = await graphqlClient.request(LOGIN_MUTATION, {
        email,
        password,
      }) as { login: { token: string; user: User } };
      const { token, user: loginUser } = response.login;
      localStorage.setItem('token', token);
      graphqlClient.setHeader('authorization', `Bearer ${token}`);
      setUser(loginUser);
    } catch (error) {
      throw new Error(getFriendlyError(error) || 'O e-mail fornecido ou a senha estão errados.');
    }
  }, [getFriendlyError]);

  const handleSignup = useCallback(async (email: string, password: string, name: string) => {
    try {
      const response = await graphqlClient.request(SIGNUP_MUTATION, {
        email,
        password,
        name,
      }) as { signup: { token: string; user: User } };
      const { token, user: signupUser } = response.signup;
      localStorage.setItem('token', token);
      graphqlClient.setHeader('authorization', `Bearer ${token}`);
      setUser(signupUser);
    } catch (error) {
      throw new Error(getFriendlyError(error) || 'Erro ao criar conta.');
    }
  }, [getFriendlyError]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    graphqlClient.setHeader('authorization', '');
  }, []);

  return {
    user,
    loading,
    checkAuth,
    handleLogin,
    handleSignup,
    handleLogout,
  };
};
