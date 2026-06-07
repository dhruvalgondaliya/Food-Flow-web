import React, { createContext, useContext, useState, useCallback } from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { BiCheckCircle } from "react-icons/bi";
import { BiErrorCircle } from "react-icons/bi";
import { IoWarningOutline } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  // Add alert
  const showAlert = useCallback((message, type = "info") => {
    const id = Date.now();
    setAlerts((prev) => [...prev, { id, message, type }]);

    // auto remove after 3s
    setTimeout(() => {
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    }, 3000);
  }, []);

  // Manually remove
  const removeAlert = (id) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  // Alert colors and icons
  const typeStyles = {
    info: { bg: "bg-blue-500", icon: <AiOutlineInfoCircle size={20} /> },
    success: { bg: "bg-green-500", icon: <BiCheckCircle size={20} /> },
    error: { bg: "bg-red-500", icon: <BiErrorCircle size={20} /> },
    warning: { bg: "bg-yellow-500", icon: <IoWarningOutline size={20} /> },
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {/* Alerts Container */}
      <div className="fixed top-4 right-4 space-y-5 z-50 w-85">
        {alerts.map((alert) => {
          const style = typeStyles[alert.type] || typeStyles.info;
          return (
            <div
              key={alert.id}
              className={`${style.bg} text-white px-4 py-3 rounded shadow-lg flex items-center justify-between`}
            >
              <div className="flex items-center gap-2">
                {style.icon}
                <span>{alert.message}</span>
              </div>
              <button onClick={() => removeAlert(alert.id)}>
                <IoMdClose size={18} />
              </button>
            </div>
          );
        })}
      </div>
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};
