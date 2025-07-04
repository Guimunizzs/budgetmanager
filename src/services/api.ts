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
      console.log("🚀 Fazendo request para: /transactions");
      console.log(
        "🔗 URL completa:",
        `${import.meta.env.VITE_SHEET2API_URL}/transactions`
      );

      const response = await api.get("/transactions");

      console.log("📋 Raw response data:", response.data);
      console.log("📋 Response data keys:", Object.keys(response.data || {}));

      // Verificar se é array
      if (!Array.isArray(response.data)) {
        console.warn("⚠️ API não retornou array:", response.data);

        // Se veio em um wrapper, extrair
        if (response.data && Array.isArray(response.data.data)) {
          console.log("🔧 Extraindo array de response.data.data");
          return response.data.data;
        }

        return [];
      }

      console.log(
        "✅ Sucesso! Retornando array com",
        response.data.length,
        "transações"
      );
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
      id: Date.now().toString(),
    };

    const response = await api.post("/transactions", newTransaction);
    return response.data;
  },

  // Deletar transação
  delete: async (id: string): Promise<void> => {
    try {
      console.log("🗑️ Tentando deletar transação ID:", id);
      console.log(
        "🔗 URL:",
        `${import.meta.env.VITE_SHEET2API_URL}/transactions/${id}`
      );

      const response = await api.delete(`/transactions/${id}`);

      console.log("✅ Delete bem-sucedido:", response.status);
    } catch (error) {
      console.log("💥 Erro ao deletar:", {
        message: error instanceof Error ? error.message : "Unknown error",
        status: axios.isAxiosError(error) ? error.response?.status : undefined,
        statusText: axios.isAxiosError(error)
          ? error.response?.statusText
          : undefined,
      });

      // Se for 404, não é um erro crítico
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        console.log(
          "⚠️ 404 - Transação não encontrada (pode já ter sido deletada)"
        );
        return; // Não rejeitar - tratar como sucesso
      }

      // Outros erros são críticos
      throw error;
    }
  },
};

// Exportar a instância do axios caso precise em outros lugares
export default api;
