import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Layout from "../layout/Layout";

const ProtectedRoute = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default ProtectedRoute;
