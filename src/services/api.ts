import axios from "axios";
import type { Transaction, CreateTransactionDate } from "../types/types";

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
  getAll: async (userId: string): Promise<Transaction[]> => {
    try {
      const response = await api.get(`/?userId=${userId}`);

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
    transaction: Omit<Transaction, "id" | "userId">,
    userId: string
  ): Promise<Transaction> => {
    const newTransaction = {
      ...transaction,
      userId: userId,
      id: crypto.randomUUID(),
    };

    const response = await api.post("/", newTransaction);
    return response.data;
  },

  // Atualizar transação (ainda não implementamos, mas seria assim)
  update: async (
    id: string,
    transaction: CreateTransactionDate,
    userId: string
  ): Promise<Transaction> => {
    // Apenas atualiza se o ID da transação E o userId baterem
    const response = await api.put<Transaction[]>(
      `/?id=${id}&userId=${userId}`,
      transaction
    );
    if (response.data.length === 0)
      throw new Error(
        "Falha ao atualizar: Transação não encontrada ou pertence a outro usuário."
      );
    return response.data[0];
  },

  // Deletar transação
  delete: async (id: string, userId: string): Promise<void> => {
    // Apenas deleta se o ID da transação E o userId baterem
    const response = await api.delete<any>(`/?id=${id}&userId=${userId}`);
    // A API da Sheet2API retorna { "deleted": 1 } em sucesso.
    if (response.data.deleted === 0) {
      throw new Error(
        "Falha ao deletar: Transação não encontrada ou pertence a outro usuário."
      );
    }
  },

  getById: async (id: string): Promise<Transaction> => {
    const response = await api.get(`/?id=${id}`);
    return response.data[0];
  },
};

export default api;
