export const useErrorHandling = () => {
  const translateServerError = (msg: string): string => {
    if (!msg) return 'Erro desconhecido.';
    
    const translations: Record<string, string> = {
      'User already exists': 'Usuário já existe.',
      'Invalid credentials': 'E-mail ou senha incorretos.',
      'Invalid email or password': 'E-mail ou senha incorretos.',
      'Invalid password': 'Senha incorreta.',
    };
    
    for (const [en, pt] of Object.entries(translations)) {
      if (msg.toLowerCase().includes(en.toLowerCase())) {
        return pt;
      }
    }
    return msg;
  };

  const getFriendlyError = (error: any): string => {
    if (!error) return 'Erro desconhecido.';

    if (error.response?.errors?.[0]?.message) {
      const serverMsg = error.response.errors[0].message;
      return translateServerError(serverMsg);
    }

    if (typeof error.message === 'string') {
      const m = error.message.match(/^([^:\n\{]+?)(?=:\s*\{)/);
      if (m && m[1]) {
        return translateServerError(m[1].trim());
      }

      try {
        const parsed = JSON.parse(error.message);
        if (parsed?.response?.errors?.[0]?.message) {
          return translateServerError(parsed.response.errors[0].message);
        }
      } catch {}

      return translateServerError(error.message);
    }

    return 'Erro desconhecido.';
  };

  return { translateServerError, getFriendlyError };
};
