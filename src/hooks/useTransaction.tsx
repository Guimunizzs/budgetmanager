import { useState, useEffect, useCallback } from "react";
import { transactionService } from "../services/api";
import type { Transaction, CreateTransactionDate } from "../types/types";
import { useAuth } from "../context/AuthContext";

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
        console.log("🔄 Estado local atualizado:", updated.length);
        return updated;
      });

      return newTransaction;
    } catch (err) {
      console.error("❌ Erro ao adicionar:", err);
      setError(
        err instanceof Error ? err.message : "Erro ao adicionar transação"
      );
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
      console.log(`🔄 Hook: Atualizando transação ID: ${id}`);
      const updatedTransaction = await transactionService.update(
        id,
        transactionData,
        currentUser.uid
      );

      // Atualiza a lista de transações no estado local de forma otimista
      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? updatedTransaction : t))
      );
      console.log("✅ Hook: Estado local atualizado com a transação editada.");

      // Opcional: Forçar um refetch para garantir a sincronia total com o backend
      // setTimeout(() => fetchTransactions(true), 1500);

      return updatedTransaction;
    } catch (err) {
      console.error("❌ Hook: Erro ao atualizar transação:", err);
      setError(
        err instanceof Error ? err.message : "Erro ao atualizar a transação"
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
      console.log("🗑️ Iniciando remoção da transação:", id);
      setIsDeleting(id);

      // OPÇÃO 1: Remove do servidor primeiro, depois do estado local
      try {
        await transactionService.delete(id, currentUser.uid);
        console.log("✅ Transação removida do servidor");

        // Sucesso no servidor = remove do estado local
        setTransactions((prev) => {
          const updated = prev.filter((t) => t.id !== id);
          console.log(
            "🔄 Estado local atualizado após remoção:",
            updated.length
          );
          return updated;
        });
      } catch (serverError) {
        console.warn("⚠️ Falha no servidor, mas tentando remover localmente");

        // Se falhar no servidor, remove localmente e recarrega depois
        setTransactions((prev) => prev.filter((t) => t.id !== id));

        // Recarrega depois de 2 segundos para verificar
        setTimeout(() => {
          console.log("🔄 Recarregando para verificar sincronização...");
          fetchTransactions();
        }, 2000);
      }
    } catch (err) {
      console.error("❌ Erro ao remover:", err);
      setError(
        err instanceof Error ? err.message : "Erro ao remover transação"
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
