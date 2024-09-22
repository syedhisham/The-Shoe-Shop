import React from 'react';
import ManageProducts from './ManageProducts';

const GentsNewArrivals = () => {
  return (
    <div>
      <ManageProducts
        renderSmallCard={false}
        allProductProp={true}
        defaultCategory="Gents Footwear"
        sortBy="dateAdded"  // Assuming 'dateAdded' is the field that tracks when the product was added
        sortOrder="desc"     // Sort in descending order to show the most recent products first
      />
    </div>
  );
};

export default GentsNewArrivals;
