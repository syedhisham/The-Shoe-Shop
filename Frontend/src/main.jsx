import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ThemeProvider } from "@material-tailwind/react";
import { ProductProvider } from "./context/ProductContext.jsx";
import { NavigationProvider } from "./context/NavigationContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <NavigationProvider>
        <ProductProvider>
          <App />
        </ProductProvider>
      </NavigationProvider>
    </ThemeProvider>
  </React.StrictMode>
);
