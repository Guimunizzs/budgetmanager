import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { useState } from "react";

const Header = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Você foi desconectado com sucesso!");
      navigate("/login");
      setIsMenuOpen(false);
    } catch (error) {
      toast.error("Erro ao desconectar.");
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="bg-gray-800 text-white">
      <header className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-xl sm:text-2xl font-bold">Budget Manager</h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <ul className="flex space-x-6">
                <li>
                  <Link
                    to="/dashboard"
                    className="text-gray-300 hover:text-white hover:underline transition-colors duration-200"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/transactions"
                    className="text-gray-300 hover:text-white hover:underline transition-colors duration-200"
                  >
                    Transações
                  </Link>
                </li>
                <li>
                  <Link
                    to="/budget"
                    className="text-gray-300 hover:text-white hover:underline transition-colors duration-200"
                  >
                    Orçamento
                  </Link>
                </li>
              </ul>
              {currentUser && (
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors duration-200"
                >
                  Sair
                </button>
              )}
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-colors duration-200"
                aria-expanded="false"
              >
                <span className="sr-only">Abrir menu principal</span>
                {!isMenuOpen ? (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-700">
              <Link
                to="/dashboard"
                onClick={closeMenu}
                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-600 transition-colors duration-200"
              >
                Dashboard
              </Link>
              <Link
                to="/transactions"
                onClick={closeMenu}
                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-600 transition-colors duration-200"
              >
                Transações
              </Link>
              <Link
                to="/budget"
                onClick={closeMenu}
                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-600 transition-colors duration-200"
              >
                Orçamento
              </Link>
              {currentUser && (
                <button
                  onClick={handleLogout}
                  className="w-full text-left bg-red-600 text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-red-700 transition-colors duration-200 mt-4"
                >
                  Sair
                </button>
              )}
            </div>
          </div>
        )}
      </header>
    </div>
  );
};

export default Header;
