import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Erro ao desconectar:", error);
    }
  };

  return (
    <div className=" bg-gray-800 text-white">
      <header className=" bg-blue-500 text-white p-4">
        <h1 className="text-2xl font-bold">Budget Manager</h1>
        <nav className="flex justify-between items-center mt-2">
          <ul className="flex  space-x-4">
            <li>
              <Link to="/dashboard" className="hover:underline">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/transactions" className="hover:underline">
                Transactions
              </Link>
            </li>
            <li>
              <Link to="/budget" className="hover:underline">
                Budget
              </Link>
            </li>
          </ul>
          <ul>
            {currentUser && (
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Sair
              </button>
            )}
          </ul>
        </nav>
      </header>
    </div>
  );
};

export default Header;
