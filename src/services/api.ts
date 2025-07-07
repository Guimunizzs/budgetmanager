import axios from "axios";
import type { Transaction } from "../types/types";

const api = axios.create({
  baseURL: import.meta.env.VITE_SHEET2API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 segundos
});

// Debug
console.log("🔧 API Base URL:", import.meta.env.VITE_SHEET2API_URL);

// Interceptor para tratar erros globalmente
api.interceptors.response.use(
  (response) => {
    console.log("✅ Response status:", response.status);
    console.log("📦 Response data type:", typeof response.data);

    // Se retornou HTML, é erro
    if (
      typeof response.data === "string" &&
      response.data.includes("<!doctype html>")
    ) {
      console.error("❌ API retornou HTML em vez de JSON");
      throw new Error(
        "Sheet2API retornou HTML. Possíveis problemas: 1) Aba não existe, 2) URL incorreta, 3) Planilha não pública"
      );
    }

    return response;
  },
  (error) => {
    console.error("❌ API Error:", error);
    return Promise.reject(error);
  }
);

// CRUD para Transações
export const transactionService = {
  // Listar todas as transações
  getAll: async (): Promise<Transaction[]> => {
    try {
      const response = await api.get("/");

      // Suas validações de array continuam perfeitas aqui...
      if (!Array.isArray(response.data)) {
        // ...
        return [];
      }
      return response.data;
    } catch (error) {
      console.error("💥 Erro ao buscar transações:", error);
      throw error;
    }
  },

  // Criar nova transação
  create: async (
    transaction: Omit<Transaction, "id">
  ): Promise<Transaction> => {
    const newTransaction = {
      ...transaction,
      id: crypto.randomUUID(),
    };

    const response = await api.post("/", newTransaction);
    return response.data;
  },

  // Atualizar transação (ainda não implementamos, mas seria assim)
  update: async (
    id: string,
    transaction: Partial<Transaction>
  ): Promise<Transaction> => {
    // CORREÇÃO: O ID vai como parâmetro de busca, não no caminho.
    const response = await api.put(`/?id=${id}`, transaction);
    return response.data;
  },

  // Deletar transação
  delete: async (id: string): Promise<void> => {
    try {
      console.log("🗑️ Tentando deletar transação ID:", id);

      const response = await api.delete(`/?id=${id}`);

      console.log("✅ Delete bem-sucedido:", response.status);
    } catch (error) {
      console.error("❌ Erro ao deletar transação:", error);
      throw error;
    }
  },

  getById: async (id: string): Promise<Transaction> => {
    const response = await api.get(`/?id=${id}`);
    return response.data[0];
  },
};

export default api;
