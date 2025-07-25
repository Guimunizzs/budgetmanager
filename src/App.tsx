import { BrowserRouter } from "react-router-dom";
import { Router } from "./router/Router";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
// Futuras adições:

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Router />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
