import React from 'react';
import ManageProducts from './ManageProducts';

const GentsSandals = () => {
  return (
    <div>
      <ManageProducts
        renderSmallCard={false}
        allProductProp={true}
        defaultCategory="Gents Footwear"
        defaultSubcategory="Sandals"
      />
    </div>
  );
};

export default GentsSandals;
