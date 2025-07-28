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
  ) => Promise<void>;
  updateTransaction: (
    id: string,
    transaction: CreateTransactionDate,
    userId: string
  ) => Promise<void>;
  deleteTransaction: (id: string, userId: string) => Promise<void>;
}

const useTransactionStore = create<TransactionStore>((set) => ({
  transactions: [],
  loading: true,
  error: null,
  isDeleting: null,
  fetchTransactions: async (userId) => {
    set({ loading: true, error: null });
    try {
      const transactions = await transactionService.getAll(userId);
      set({ transactions, loading: false });
    } catch (error) {
      set({
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : "Erro ao carregar transações",
      });
    }
  },
  addTransaction: async (transaction, userId) => {
    try {
      const newTransaction = await transactionService.create(
        transaction,
        userId
      );
      set((state) => ({
        transactions: [...state.transactions, newTransaction],
      }));
      toast.success("Transação adicionada com sucesso!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao adicionar transação"
      );
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
      toast.success("Transação atualizada com sucesso!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao atualizar transação"
      );
    }
  },
  deleteTransaction: async (id, userId) => {
    set({ isDeleting: id });
    try {
      await transactionService.delete(id, userId);
      set((state) => ({
        transactions: state.transactions.filter((t) => t.id !== id),
        isDeleting: null,
      }));
      toast.success("Transação deletada com sucesso!");
    } catch (error) {
      set({ isDeleting: null });
      toast.error(
        error instanceof Error ? error.message : "Erro ao deletar transação"
      );
    }
  },
}));
export default useTransactionStore;
