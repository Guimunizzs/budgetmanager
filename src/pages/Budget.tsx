import { useTransactions } from "../hooks/useTransaction";

const budgetLimits = {
  Alimentação: 1000,
  Transporte: 400,
  Moradia: 1500,
  Saúde: 500,
  Lazer: 300,
  Compras: 600,
  Contas: 800,
  Educação: 200,
  Outros: 150,
};

// Componente para a barra de progresso (reutilizável)
const ProgressBar = ({ value, max }: { value: number; max: number }) => {
  const percentage = max > 0 ? (value / max) * 100 : 0;
  let barColor = "bg-blue-500"; // Cor padrão

  if (percentage > 90) {
    barColor = "bg-red-500"; // Alerta
  } else if (percentage > 75) {
    barColor = "bg-yellow-500"; // Aviso
  }

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div
        className={`${barColor} h-2.5 rounded-full transition-all duration-500`}
        style={{ width: `${Math.min(percentage, 100)}%` }}
      ></div>
    </div>
  );
};

const Budget = () => {
  const { transactions, loading, error } = useTransactions();

  // 2. Calcular os gastos totais por categoria
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

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>Erro ao carregar dados: {error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Meu Orçamento</h1>
        <p className="text-sm text-gray-600 mt-1">
          Acompanhe seus gastos em relação aos seus limites.
        </p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <ul className="divide-y divide-gray-200">
          {Object.entries(budgetLimits).map(([category, limit]) => {
            const spent = expensesByCategory[category] || 0;
            const remaining = limit - spent;

            return (
              <li key={category} className="px-6 py-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-900">
                    {category}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium text-gray-700">
                      R${" "}
                      {spent.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </span>{" "}
                    / R${" "}
                    {limit.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <ProgressBar value={spent} max={limit} />
                <div className="text-right mt-1">
                  <p
                    className={`text-xs font-medium ${
                      remaining >= 0 ? "text-gray-500" : "text-red-500"
                    }`}
                  >
                    {remaining >= 0
                      ? `Restam R$ ${remaining.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}`
                      : `Excedeu R$ ${Math.abs(remaining).toLocaleString(
                          "pt-BR",
                          { minimumFractionDigits: 2 }
                        )}`}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Budget;
