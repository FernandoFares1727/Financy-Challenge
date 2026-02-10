
import React, { useState } from 'react';
import { Card, Input, Button } from '../components/UI';

interface AuthProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onSignup: (email: string, password: string, name: string) => Promise<void>;
}

export const Auth: React.FC<AuthProps> = ({ onLogin, onSignup }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await onLogin(email, password);
      } else {
        await onSignup(email, password, name);
      }
    } catch (err) {
      const msg = (err as any)?.message || 'Ocorreu um erro. Tente novamente.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="w-16 h-16 bg-brand rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-brand/20">
            <span className="text-white font-bold text-3xl">$</span>
          </div>
          <h1 className="text-4xl font-black text-brand tracking-tighter">FINANCY</h1>
        </div>

        <Card className="shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
            {isLogin ? 'Fazer login' : 'Criar conta'}
          </h2>
          <p className="text-gray-500 text-sm text-center mb-8">
            {isLogin ? 'Entre na sua conta para continuar' : 'Comece a controlar suas finanças ainda hoje'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <Input 
                label="Nome completo" 
                placeholder="Seu nome"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
              />
            )}
            <Input 
              label="E-mail" 
              type="email"
              placeholder="mail@exemplo.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
            />
            
            <Input 
              label="Senha" 
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}
            />

            {error && <p className="text-expense text-sm font-medium">{error}</p>}

            <Button type="submit" fullWidth disabled={loading}>
              {loading ? 'Processando...' : isLogin ? 'Entrar' : 'Cadastrar'}
            </Button>
          </form>

          <div className="mt-8 text-center border-t border-gray-100 pt-6">
            <p className="text-sm text-gray-500 mb-4">
              {isLogin ? 'Ainda não tem uma conta?' : 'Já tem uma conta?'}
            </p>
            <Button variant="outline" size="sm" fullWidth onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Criar conta' : 'Fazer login'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
