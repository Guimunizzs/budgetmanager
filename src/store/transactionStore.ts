import { create } from "zustand";
import { transactionService } from "../services/api";
import type { Transaction, CreateTransactionDate } from "../types/types";
import toast from "react-hot-toast";

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

const useTransactionStore = create<TransactionStore>((set, get) => ({
  transactions: [],
  loading: true,
  error: null,
  isDeleting: null,

  fetchTransactions: async (userId) => {
    if (get().transactions.length > 0 && !get().loading) {
      return;
    }
    set({ loading: true, error: null });
    try {
      const transactions = await transactionService.getAll(userId);
      set({ transactions, loading: false });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao carregar transações";
      set({ loading: false, error: message });
      toast.error(message);
    }
  },

  addTransaction: async (
    transaction: CreateTransactionDate,
    userId: string
  ): Promise<Transaction> => {
    try {
      const newTransaction = await transactionService.create(
        transaction,
        userId
      );

      set((state) => ({
        transactions: [newTransaction, ...state.transactions],
      }));
      toast.success("Transação adicionada!");
      return newTransaction;
    } catch (error) {
      toast.error("Erro ao adicionar transação.");
      throw error;
    }
  },

  updateTransaction: async (id, transaction, userId) => {
    try {
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
      throw error;
    }
  },

  deleteTransaction: async (id, userId) => {
    const originalTransactions = get().transactions;

    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    }));
    const toastId = toast.loading("Removendo...");
    try {
      await transactionService.delete(id, userId);
      toast.success("Transação removida!", { id: toastId });
    } catch (error) {
      toast.error("Falha ao remover. Restaurando...", { id: toastId });

      set({ transactions: originalTransactions });
    }
  },
}));

export default useTransactionStore;
