import { createContext, useState, useEffect, useContext } from "react";
import { useAuth } from "./AuthContext";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const getProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/items");
      const data = await res.json();
      setItems(data.result || []);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (name, price) => {
    try {
      const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, price }),
      });
      if (res.ok) {
        await getProducts();
        return { success: true };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const updateProduct = async (id, name, price) => {
    try {
      const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/items/" + id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ name, price }),
      });
      if (res.ok) {
        await getProducts();
        return { success: true };
      } else {
        const errorData = await res.json();
        return { success: false, message: errorData.message || "Error al actualizar" };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const deleteProduct = async (id) => {
    try {
      const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/items/" + id, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      if (res.ok) {
        await getProducts();
        return { success: true };
      } else {
        const errorData = await res.json();
        return { success: false, message: errorData.message || "Error al eliminar" };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <ProductContext.Provider value={{ items, loading, getProducts, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useItem = () => useContext(ProductContext);
