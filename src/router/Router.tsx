import { Route, Routes } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import Budget from "../pages/Budget";
import Layout from "../layout/Layout";
import Transactions from "../pages/Transactions";
import EditTransaction from "../pages/EditTransaction";

export function Router() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Layout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="transactions/edit/:id" element={<EditTransaction />} />
        <Route path="budget" element={<Budget />} />
      </Route>
    </Routes>
  );
}
