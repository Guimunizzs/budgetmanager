const Header = () => {
  return (
    <div className="">
      <header className="bg-blue-500 text-white p-4">
        <h1 className="text-2xl font-bold">Budget Manager</h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <a href="/dashboard" className="hover:underline">
                Dashboard
              </a>
            </li>
            <li>
              <a href="/transactions" className="hover:underline">
                Transactions
              </a>
            </li>
            <li>
              <a href="/budget" className="hover:underline">
                Budget
              </a>
            </li>
          </ul>
        </nav>
      </header>
    </div>
  );
};

export default Header;
