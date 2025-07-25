import { useState, useEffect, useCallback } from "react";
import { transactionService } from "../services/api";
import type { Transaction, CreateTransactionDate } from "../types/types";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null); // Track qual está sendo deletado
  const { currentUser } = useAuth();

  // Carregar transações
  const fetchTransactions = useCallback(async () => {
    if (!currentUser) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await transactionService.getAll(currentUser.uid);
      console.log(
        `📊 Transações carregadas para o usuário ${currentUser.uid}:`,
        data
      );
      setTransactions(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar transações"
      );
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Adicionar transação
  const addTransaction = async (
    transaction: Omit<Transaction, "id" | "userId">
  ) => {
    if (!currentUser)
      throw new Error("Usuário não autenticado para adicionar transação.");

    try {
      console.log("➕ Adicionando transação:", transaction);

      // Primeiro, adiciona no servidor
      const newTransaction = await transactionService.create(
        transaction,
        currentUser.uid
      );
      console.log("✅ Transação criada no servidor:", newTransaction);

      // Depois, atualiza o estado local
      setTransactions((prev) => {
        const updated = [newTransaction, ...prev];
        toast.success("Transação adicionada com sucesso!");
        return updated;
      });

      return newTransaction;
    } catch (err) {
      toast.error("Erro ao adicionar transação.");
      throw err;
    }
  };

  const updateTransaction = async (
    id: string,
    transactionData: CreateTransactionDate
  ) => {
    if (!currentUser)
      throw new Error("Usuário não autenticado para atualizar transação.");

    try {
      const updatedTransaction = await transactionService.update(
        id,
        transactionData,
        currentUser.uid
      );
      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? updatedTransaction : t))
      );
      toast.success("Transação atualizada com sucesso!");

      // Opcional: Forçar um refetch para garantir a sincronia total com o backend
      // setTimeout(() => fetchTransactions(true), 1500);

      return updatedTransaction;
    } catch (err) {
      toast.error(
        "Erro ao atualizar transação. Verifique os dados e tente novamente."
      );
      // Re-lança o erro para que o componente do formulário possa saber que falhou
      throw err;
    }
  };

  // Remover transação - VERSÃO MAIS ROBUSTA
  const removeTransaction = async (id: string) => {
    if (!currentUser)
      throw new Error("Usuário não autenticado para remover transação.");

    try {
      setIsDeleting(id);

      // OPÇÃO 1: Remove do servidor primeiro, depois do estado local
      try {
        await transactionService.delete(id, currentUser.uid);
        toast.success("Transação removida com sucesso.");

        // Sucesso no servidor = remove do estado local
        setTransactions((prev) => {
          const updated = prev.filter((t) => t.id !== id);
          toast.success("Estado local atualizado após remoção.");
          return updated;
        });
      } catch (serverError) {
        toast.error(
          "Erro ao remover transação no servidor. Tentando remover localmente..."
        );
        // Se falhar no servidor, remove localmente e recarrega depois
        setTransactions((prev) => prev.filter((t) => t.id !== id));

        // Recarrega depois de 2 segundos para verificar
        setTimeout(() => {
          console.log("🔄 Recarregando para verificar sincronização...");
          fetchTransactions();
        }, 2000);
      }
    } catch (err) {
      toast.error(
        "Erro ao remover transação. Verifique os dados e tente novamente."
      );
    } finally {
      setIsDeleting(null);
    }
  };

  return {
    transactions,
    loading,
    error,
    isDeleting,
    addTransaction,
    updateTransaction,
    removeTransaction,
    refetch: fetchTransactions,
  };
};
