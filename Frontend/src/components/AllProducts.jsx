import React from "react";
import ManageProducts from "../pages/ManageProducts";

const AllProducts = () => {
  return (
    <div>
      <ManageProducts renderSmallCard={false} allProductProp={true} />
    </div>
  );
};

export default AllProducts;
