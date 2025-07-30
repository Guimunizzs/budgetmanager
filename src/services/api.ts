import axios from "axios";
import type { Transaction, CreateTransactionDate } from "../types/types";

const api = axios.create({
  baseURL: import.meta.env.VITE_SHEET2API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 segundos
});

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
  getAll: async (userId: string): Promise<Transaction[]> => {
    try {
      const response = await api.get(`/?userId=${userId}`);

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

  update: async (
    id: string,
    transaction: CreateTransactionDate,
    userId: string
  ): Promise<Transaction> => {
    // ✅ 2. ENVIAR O OBJETO COMPLETO NO UPDATE
    // Isso evita que a API apague o campo 'id' da sua planilha.
    const fullTransactionData = {
      ...transaction, // Os dados do formulário (descrição, amount, etc.)
      id: id, // O ID existente da transação que estamos editando
      userId: userId, // O ID do usuário
    };

    // Enviamos o objeto completo no corpo da requisição PUT.
    const response = await api.put<Transaction[]>(
      `/?id=${id}&userId=${userId}`,
      fullTransactionData
    );

    if (response.data.length === 0)
      throw new Error(
        "Falha ao atualizar: Transação não encontrada ou pertence a outro usuário."
      );

    // A API retorna a linha atualizada, que podemos retornar com segurança.
    return response.data[0];
  },

  delete: async (id: string, userId: string): Promise<void> => {
    const response = await api.delete<any>(`/?id=${id}&userId=${userId}`);

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
