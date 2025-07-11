import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTransactions } from "../hooks/useTransaction";
import { transactionService } from "../services/api";

import type {
  TransactionFormValues,
  CreateTransactionDate,
} from "../types/types";

interface TransactionFormProps {
  transactionId?: string;
}

const TransactionForm = ({ transactionId }: TransactionFormProps) => {
  const { addTransaction, updateTransaction } = useTransactions();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<TransactionFormValues>({
    description: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    category: "",
    type: "income",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!transactionId;

  useEffect(() => {
    if (isEditMode) {
      const fetchTransactionData = async () => {
        try {
          console.log(
            `🔍 Buscando dados para a transação ID: ${transactionId}`
          );
          const data = await transactionService.getById(transactionId);
          console.log("✅ Dados recebidos para edição:", data);

          // Preenche o formulário com os dados recebidos
          setFormData({
            description: data.description,
            amount: String(data.amount), // Converte o número para string para o input
            date: new Date(data.date).toISOString().split("T")[0], // Formata a data corretamente
            category: data.category,
            type: data.type,
          });
        } catch (error) {
          console.error("❌ Erro ao buscar dados da transação:", error);
          alert("Não foi possível carregar os dados para edição.");
          navigate("/dashboard");
        }
      };
      fetchTransactionData();
    }
  }, [transactionId, isEditMode, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const transactionData: CreateTransactionDate = {
        description: formData.description,
        amount: parseFloat(formData.amount),
        date: formData.date,
        category: formData.category,
        type: formData.type,
      };

      if (isEditMode) {
        // 🚀 MODO EDIÇÃO: Chama a função de update
        console.log(
          "🔄 Atualizando transação:",
          transactionId,
          transactionData
        );
        await updateTransaction(transactionId, transactionData);
        console.log("✅ Transação atualizada com sucesso!");
      } else {
        // ➕ MODO CRIAÇÃO: Chama a função de adicionar
        console.log("➕ Adicionando nova transação:", transactionData);
        await addTransaction(transactionData);
        console.log("✅ Nova transação adicionada com sucesso!");
      }

      // Navega para o dashboard em caso de sucesso
      navigate("/dashboard", { replace: true });
    } catch (error) {
      // O catch agora lida com erros de ambas as operações
      console.error(
        `❌ Erro ao ${isEditMode ? "atualizar" : "adicionar"} transação:`,
        error
      );
      alert(`Erro ao ${isEditMode ? "atualizar" : "adicionar"} a transação!`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tipo de Transação */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Tipo de Transação *
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({ ...prev, type: "income" }))
              }
              className={`p-4 rounded-lg border-2 transition-all ${
                formData.type === "income"
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-center">
                <svg
                  className="h-8 w-8 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 11l5-5m0 0l5 5m-5-5v12"
                  />
                </svg>
                <span className="font-medium">Receita</span>
              </div>
            </button>
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({ ...prev, type: "expense" }))
              }
              className={`p-4 rounded-lg border-2 transition-all ${
                formData.type === "expense"
                  ? "border-red-500 bg-red-50 text-red-700"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-center">
                <svg
                  className="h-8 w-8 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 13l-5 5m0 0l-5-5m5 5V6"
                  />
                </svg>
                <span className="font-medium">Despesa</span>
              </div>
            </button>
          </div>
        </div>

        {/* Descrição */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descrição *
          </label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: Salário, Supermercado, Aluguel..."
          />
        </div>

        {/* Valor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Valor (R$) *
          </label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            required
            min="0"
            step="0.01"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0,00"
          />
        </div>

        {/* Data */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data *
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Categoria */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categoria *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Selecione uma categoria</option>
            {formData.type === "income" ? (
              <>
                <option value="Salário">Salário</option>
                <option value="Freelance">Freelance</option>
                <option value="Investimentos">Investimentos</option>
                <option value="Vendas">Vendas</option>
                <option value="Outros">Outros</option>
              </>
            ) : (
              <>
                <option value="Alimentação">Alimentação</option>
                <option value="Transporte">Transporte</option>
                <option value="Moradia">Moradia</option>
                <option value="Saúde">Saúde</option>
                <option value="Educação">Educação</option>
                <option value="Lazer">Lazer</option>
                <option value="Compras">Compras</option>
                <option value="Contas">Contas</option>
                <option value="Outros">Outros</option>
              </>
            )}
          </select>
        </div>

        {/* Botões */}
        <div className="flex justify-end space-x-4 pt-6">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Adicionando..." : "Adicionar Transação"}
          </button>
        </div>
      </form>
    </div>
  );
};
export default TransactionForm;
