import { Route, Routes } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import Budget from "../pages/Budget";
import Transactions from "../pages/Transactions";
import EditTransaction from "../pages/EditTransaction";
import ProtectedRoute from "./ProtectedRoute";

export function Router() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/" element={<ProtectedRoute />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="transactions/edit/:id" element={<EditTransaction />} />
        <Route path="budget" element={<Budget />} />
      </Route>
    </Routes>
  );
}
