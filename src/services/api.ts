import axios from "axios";
import type { Transaction } from "../types/types";

// Configurar instância do Axios
const api = axios.create({
  baseURL: import.meta.env.VITE_SHEET2API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 segundos
});

// Interceptor para tratar erros globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// CRUD para Transações
export const transactionService = {
  // Listar todas as transações
  getAll: async (): Promise<Transaction[]> => {
    const response = await api.get("/transactions");
    return response.data;
  },

  // Criar nova transação
  create: async (
    transaction: Omit<Transaction, "id">
  ): Promise<Transaction> => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
    };

    const response = await api.post("/transactions", newTransaction);
    return response.data;
  },

  // Atualizar transação
  update: async (
    id: string,
    transaction: Partial<Transaction>
  ): Promise<Transaction> => {
    const response = await api.put(`/transactions/${id}`, transaction);
    return response.data;
  },

  // Deletar transação
  delete: async (id: string): Promise<void> => {
    await api.delete(`/transactions/${id}`);
  },

  // Buscar transação por ID
  getById: async (id: string): Promise<Transaction> => {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
  },
};

// Exportar a instância do axios caso precise em outros lugares
export default api;
