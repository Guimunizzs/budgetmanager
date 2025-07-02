import { useState, useEffect } from "react";
import type { Transaction } from "../types/types";
import { transactionService } from "../services/api";

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar transações
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await transactionService.getAll();
      setTransactions(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar transações"
      );
    } finally {
      setLoading(false);
    }
  };

  // Adicionar transação
  const addTransaction = async (transaction: Omit<Transaction, "id">) => {
    try {
      const newTransaction = await transactionService.create(transaction);
      setTransactions((prev) => [newTransaction, ...prev]);
      return newTransaction;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao adicionar transação"
      );
      throw err;
    }
  };

  // Remover transação
  const removeTransaction = async (id: string) => {
    try {
      await transactionService.delete(id);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao remover transação"
      );
      throw err;
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return {
    transactions,
    loading,
    error,
    addTransaction,
    removeTransaction,
    refetch: fetchTransactions,
  };
};
