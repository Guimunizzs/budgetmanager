import { useTransactions } from "../hooks/useTransaction";

const Dashboard = () => {
  const { transactions, loading, error, addTransaction, removeTransaction } =
    useTransactions();

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error loading transactions: {error}</div>;
  }

  // 🔥 PROTEÇÃO CRÍTICA: Garantir que transactions é sempre um array
  const safeTransactions = Array.isArray(transactions) ? transactions : [];

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Total de transações: {safeTransactions.length}</p>

      {/* Mostrar aviso se não for array */}
      {!Array.isArray(transactions) && (
        <div style={{ color: "red", padding: "10px", border: "1px solid red" }}>
          ⚠️ Erro: API retornou dados inválidos. Verifique a configuração do
          Sheet2API.
        </div>
      )}

      <button
        onClick={() =>
          addTransaction({
            description: "Teste",
            amount: 100,
            date: "2025-06-30",
            category: "Test",
            type: "income",
          })
        }
      >
        Adicionar Transação de Teste
      </button>
      <h2>Transações</h2>
      {safeTransactions.map((transaction) => (
        <div key={transaction.id}>
          {transaction.description} - R$ {transaction.amount}
          <button onClick={() => removeTransaction(transaction.id)}>
            Excluir
          </button>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
