import { useState, useEffect } from "react";
import { transactionService } from "../services/api";
import type { Transaction } from "../types/types";

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null); // Track qual está sendo deletado

  // Carregar transações
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await transactionService.getAll();
      console.log("📊 Transações carregadas:", data);
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

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Adicionar transação
  const addTransaction = async (transaction: Omit<Transaction, "id">) => {
    try {
      console.log("➕ Adicionando transação:", transaction);

      // Primeiro, adiciona no servidor
      const newTransaction = await transactionService.create(transaction);
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

  // Remover transação - VERSÃO MAIS ROBUSTA
  const removeTransaction = async (id: string) => {
    try {
      console.log("🗑️ Iniciando remoção da transação:", id);
      setIsDeleting(id);

      // OPÇÃO 1: Remove do servidor primeiro, depois do estado local
      try {
        await transactionService.delete(id);
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

  useEffect(() => {
    fetchTransactions();
  }, []);

  return {
    transactions,
    loading,
    error,
    isDeleting,
    addTransaction,
    removeTransaction,
    refetch: fetchTransactions,
  };
};
