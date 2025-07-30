import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useTransactionStore from "../store/transactionStore";
import { useAuth } from "../context/AuthContext";
import type {
  TransactionFormValues,
  CreateTransactionDate,
} from "../types/types";
import toast from "react-hot-toast";

const TransactionForm = () => {
  const { id: transactionId } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  const { addTransaction, updateTransaction, transactions } =
    useTransactionStore();
  const { currentUser } = useAuth();

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
      const existingTransaction = transactions.find(
        (t) => t.id === transactionId
      );
      if (existingTransaction) {
        setFormData({
          description: existingTransaction.description,
          amount: String(existingTransaction.amount),
          date: new Date(existingTransaction.date).toISOString().split("T")[0],
          category: existingTransaction.category,
          type: existingTransaction.type,
        });
      } else {
        toast.error("Transação não encontrada para edição.");
        navigate("/dashboard");
      }
    }
  }, [transactionId, isEditMode, navigate, transactions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error("Você precisa estar logado para realizar esta ação.");
      return;
    }
    setIsSubmitting(true);

    try {
      const transactionData: CreateTransactionDate = {
        description: formData.description,
        amount: parseFloat(formData.amount),
        date: formData.date,
        category: formData.category,
        type: formData.type,
        userId: currentUser.uid,
      };

      if (isEditMode && transactionId) {
        await updateTransaction(
          transactionId,
          transactionData,
          currentUser.uid
        );
      } else {
        // ✅ MUDANÇA CRÍTICA: Espere a operação terminar
        await addTransaction(transactionData, currentUser.uid);
      }

      // ✅ A NAVEGAÇÃO SÓ ACONTECE DEPOIS QUE TUDO ACABOU
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error(
        `Erro ao ${isEditMode ? "atualizar" : "adicionar"} transação:`,
        error
      );
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
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {isEditMode ? "Editar Transação" : "Adicionar Nova Transação"}
      </h2>
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
            // ✅ Desabilita o botão durante o envio
            disabled={isSubmitting}
            className="px-6 py-3 ... disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {/* ✅ Mostra o spinner e o texto dinâmico */}
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {isEditMode ? "Salvando..." : "Adicionando..."}
              </>
            ) : isEditMode ? (
              "Salvar Alterações"
            ) : (
              "Adicionar Transação"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
export default TransactionForm;
