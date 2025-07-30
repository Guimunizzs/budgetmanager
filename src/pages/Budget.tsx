import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import useTransactionStore from "../store/transactionStore";
import CategoryPieChart from "../components/CategoryPieChart";

// Componente para a barra de progresso (reutilizável)
const ProgressBar = ({ value, max }: { value: number; max: number }) => {
  const percentage = max > 0 ? (value / max) * 100 : 0;

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div
        className="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

const Budget = () => {
  const { currentUser } = useAuth();
  const { transactions, loading, error, fetchTransactions } =
    useTransactionStore();

  useEffect(() => {
    if (currentUser) {
      fetchTransactions(currentUser.uid);
    }
  }, [currentUser, fetchTransactions]);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  const expensesByCategory = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, transaction) => {
      const { category, amount } = transaction;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += amount;
      return acc;
    }, {} as Record<string, number>);

  const sortedCategories = Object.entries(expensesByCategory).sort(
    ([, a], [, b]) => b - a
  );

  const chartData = sortedCategories.map(([name, value]) => ({
    name,
    value,
  }));

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>Erro ao carregar dados: {error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Análise de Gastos</h1>
        <p className="text-sm text-gray-600 mt-1">
          Veja um resumo geral de suas receitas e despesas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">
            Total de Receitas
          </h3>
          <p className="mt-2 text-3xl font-bold text-green-600">
            R${" "}
            {totalIncome.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">
            Total de Despesas
          </h3>
          <p className="mt-2 text-3xl font-bold text-red-600">
            R${" "}
            {totalExpenses.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Saldo Atual</h3>
          <p
            className={`mt-2 text-3xl font-bold ${
              balance >= 0 ? "text-blue-600" : "text-red-600"
            }`}
          >
            R$ {balance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Distribuição de Gastos
          </h2>
          {chartData.length > 0 ? (
            <CategoryPieChart data={chartData} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Sem dados de despesas para exibir.
            </div>
          )}
        </div>

        <div className="lg:col-span-3 bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-800">
              Gastos por Categoria
            </h2>
          </div>
          <ul className="divide-y divide-gray-200">
            {sortedCategories.map(([category, spent]) => {
              const percentageOfTotal =
                totalExpenses > 0 ? (spent / totalExpenses) * 100 : 0;
              return (
                <li key={category} className="px-6 py-5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-900">
                      {category}
                    </p>
                    <p className="text-sm text-gray-700 font-semibold">
                      R${" "}
                      {spent.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                  <ProgressBar value={spent} max={totalExpenses} />
                  <div className="text-right mt-1">
                    <p className="text-xs text-gray-500">
                      {percentageOfTotal.toFixed(1)}% do total de despesas
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Budget;
