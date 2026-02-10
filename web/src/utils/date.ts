export const formatDate = (date: string | Date | null | undefined) => {
  try {
    // Se date é null ou undefined
    if (!date) {
      return 'Data não disponível';
    }

    let d: Date;
    
    if (typeof date === 'string') {
      // Se é uma string
      // Tenta criar a data de diferentes formas
      d = new Date(date);
      
      // Se falhar, tenta extrair a data no formato YYYY-MM-DD
      if (isNaN(d.getTime()) && date.includes('-')) {
        const parts = date.split('-');
        if (parts.length >= 3) {
          // Assume formato YYYY-MM-DD ou YYYY-MM-DDTHH:MM:SS
          const year = parseInt(parts[0]);
          const month = parseInt(parts[1]) - 1;
          const day = parseInt(parts[2].split('T')[0]);
          d = new Date(year, month, day);
        }
      }
    } else {
      d = date;
    }

    // Última verificação
    if (isNaN(d.getTime())) {
      return 'Data inválida';
    }

    return d.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  } catch (error) {
    console.error('Erro ao formatar data:', date, error);
    return 'Data inválida';
  }
};

export const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
};
