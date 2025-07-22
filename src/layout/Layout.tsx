import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

// 1. Defina as props para aceitar 'children'
interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div>
      <Header />
      <main>
        {/* 2. Renderize os filhos aqui, em vez do Outlet */}
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
