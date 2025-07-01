import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_SHEET2API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 segundos
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // O servidor respondeu com um status diferente de 2xx
      console.error("Erro na resposta:", error.response.data);
    } else if (error.request) {
      // A requisição foi feita, mas não houve resposta
      console.error("Erro na requisição:", error.request);
    } else {
      // Algo aconteceu ao configurar a requisição
      console.error("Erro:", error.message);
    }
    return Promise.reject(error);
  }
);

// Crud transactions
export const getTransactions = async () => {
  try {
    const response = await api.get("/transactions");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar transações:", error);
    throw error;
  }
};

// nova transação
export const createTransaction = async (transaction: any) => {
  try {
    const response = await api.post("/transactions", transaction);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar transação:", error);
    throw error;
  }
};

// Atualizar transação
export const updateTransaction = async (id: string, transaction: any) => {
  try {
    const response = await api.put(`/transactions/${id}`, transaction);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar transação:", error);
    throw error;
  }
};

// Deletar transação
export const deleteTransaction = async (id: string) => {
  try {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao deletar transação:", error);
    throw error;
  }
};

// buscar transação por ID
export const getTransactionById = async (id: string) => {
  try {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar transação por ID:", error);
    throw error;
  }
};
