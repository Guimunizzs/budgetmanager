import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div>
      <header>
        <h1>Budget Manager</h1>
        {/* Aqui você pode adicionar navegação, menu, etc. */}
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
