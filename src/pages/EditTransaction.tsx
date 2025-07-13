import TransactionForm from "../components/TransactionForm";
import { useParams, useNavigate } from "react-router-dom";

const EditTransaction = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  if (!id) {
    navigate("/dashboard");
    return null;
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Editar Transação
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Modifique os detalhes da sua transação
              </p>
            </div>
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Voltar ao Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TransactionForm transactionId={id} />
      </div>
    </div>
  );
};

export default EditTransaction;
