import React, { createContext, useState } from "react";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [productId, setProductId] = useState(null);

  return (
    <ProductContext.Provider value={{ productId, setProductId }}>
      {children}
    </ProductContext.Provider>
  );
};
