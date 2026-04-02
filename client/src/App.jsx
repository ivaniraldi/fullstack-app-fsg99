import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProductProvider } from "./context/ProductContext";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <BrowserRouter>
          <div className="app-container">
            <Navigation />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Routes>
            </main>
            <footer className="py-4 mt-5 text-center text-secondary small">
              &copy; {new Date().getFullYear()} ADL Store. All rights reserved.
            </footer>
          </div>
        </BrowserRouter>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;
