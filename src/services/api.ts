import axios from 'axios';

// Criar uma instância do axios com configurações padrão
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://sturdy-telegram-gg9697wjjvxf9q6j-3000.app.github.dev',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptadores para tratamento de erros e autenticação
api.interceptors.request.use(
  (config) => {
    // Pode adicionar token de autenticação aqui
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);