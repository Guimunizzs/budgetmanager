import { create } from "zustand";
import { transactionService } from "../services/api";
import type { Transaction, CreateTransactionDate } from "../types/types";
import toast from "react-hot-toast";

// A interface continua a mesma, ela está perfeita.
interface TransactionStore {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  isDeleting: string | null;
  fetchTransactions: (userId: string) => Promise<void>;
  addTransaction: (
    transaction: CreateTransactionDate,
    userId: string
  ) => Promise<Transaction>;
  updateTransaction: (
    id: string,
    transaction: CreateTransactionDate,
    userId: string
  ) => Promise<void>;
  deleteTransaction: (id: string, userId: string) => Promise<void>;
}

// ✅ A ÚNICA MUDANÇA NECESSÁRIA ESTÁ AQUI DENTRO
const useTransactionStore = create<TransactionStore>((set, get) => ({
  transactions: [],
  loading: true,
  error: null,
  isDeleting: null,

  // 1. BUSCAR TRANSAÇÕES
  fetchTransactions: async (userId) => {
    // Evita buscas repetidas se os dados já foram carregados
    if (get().transactions.length > 0 && !get().loading) {
      return;
    }
    set({ loading: true, error: null });
    try {
      // O service já garante que o 'amount' é um número
      const transactions = await transactionService.getAll(userId);
      set({ transactions, loading: false });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao carregar transações";
      set({ loading: false, error: message });
      toast.error(message);
    }
  },

  // 2. ADICIONAR TRANSAÇÃO
  addTransaction: async (
    transaction: CreateTransactionDate,
    userId: string
  ): Promise<Transaction> => {
    try {
      // O service já garante que o 'amount' será um número na resposta
      const newTransaction = await transactionService.create(
        transaction,
        userId
      );
      // Adiciona a nova transação no início da lista
      set((state) => ({
        transactions: [newTransaction, ...state.transactions],
      }));
      toast.success("Transação adicionada!");
      return newTransaction; // 👈 MUDANÇA AQUI: Retorne o objeto criado
    } catch (error) {
      toast.error("Erro ao adicionar transação.");
      throw error; // Re-lança o erro para o formulário
    }
  },

  // 3. ATUALIZAR TRANSAÇÃO
  updateTransaction: async (id, transaction, userId) => {
    try {
      // O service já garante que o 'amount' será um número na resposta
      const updatedTransaction = await transactionService.update(
        id,
        transaction,
        userId
      );
      set((state) => ({
        transactions: state.transactions.map((t) =>
          t.id === id ? updatedTransaction : t
        ),
      }));
      toast.success("Transação atualizada!");
    } catch (error) {
      toast.error("Erro ao atualizar transação.");
      throw error; // Re-lança o erro para o formulário
    }
  },

  // 4. DELETAR TRANSAÇÃO
  deleteTransaction: async (id, userId) => {
    const originalTransactions = get().transactions;
    // Atualização otimista: remove da UI primeiro
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    }));
    const toastId = toast.loading("Removendo...");
    try {
      await transactionService.delete(id, userId);
      toast.success("Transação removida!", { id: toastId });
    } catch (error) {
      toast.error("Falha ao remover. Restaurando...", { id: toastId });
      // Se falhar, restaura o estado original
      set({ transactions: originalTransactions });
    }
  },
}));

export default useTransactionStore;
