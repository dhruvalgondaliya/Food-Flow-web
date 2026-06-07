import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { MenuProvider } from "./ContextProvider/MenuContext.jsx";
import { AlertProvider } from "./ContextProvider/AlertContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <MenuProvider>
      <AlertProvider>
        <App />
      </AlertProvider>
    </MenuProvider>
  </BrowserRouter>
);
