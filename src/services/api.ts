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
    // Usar CreateTransactionDate para garantir que todos os campos sejam enviados
    transaction: CreateTransactionDate
  ): Promise<Transaction> => {
    try {
      console.log(`🌐 PUT /?id=${id}`, transaction);
      // Sua lógica de usar /?id=${id} está perfeita para a Sheet2API
      const response = await api.put<Transaction>(`/?id=${id}`, transaction);

      // Sheet2API retorna um array com o item atualizado, então pegamos o primeiro
      if (Array.isArray(response.data) && response.data.length > 0) {
        console.log("✅ Update bem-sucedido:", response.data[0]);
        return response.data[0];
      }

      // Fallback caso a API retorne algo inesperado
      console.warn(
        "⚠️ Update retornou uma resposta inesperada:",
        response.data
      );
      // Retornamos os dados enviados com o ID para manter a consistência no frontend
      return { ...transaction, id };
    } catch (error) {
      console.error(`❌ Erro no update para o ID ${id}:`, error);
      throw error;
    }
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
