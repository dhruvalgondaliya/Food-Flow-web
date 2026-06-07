import  { createContext, useContext, useEffect, useState } from "react";
import { fetchAllMenus } from "../Component/Api/MenuApi";


// Create context
const MenuContext = createContext();

// Provider component
export const MenuProvider = ({ children }) => {
  const [menuData, setMenuData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch menus & categories
  const loadMenus = async () => {
    setLoading(true);
    try {
      const data = await fetchAllMenus();
      setMenuData(data);
      setCategories(data.flatMap((m) => m.categories || []));
      setError(null);
    } catch (err) {
      setError("Failed to Fetch Category Items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenus();
  }, []);

  return (
    <MenuContext.Provider
      value={{ menuData, categories, loading, error, refreshMenus: loadMenus }}
    >
      {children}
    </MenuContext.Provider>
  );
};

// Hook for easy usage
export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error("useMenu must be used within a MenuProvider");
  }
  return context;
};
