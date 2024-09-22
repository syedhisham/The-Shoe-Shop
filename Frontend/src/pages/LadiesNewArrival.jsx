import React from 'react'
import ManageProducts from './ManageProducts'

const LadiesNewArrival = () => {
  return (
    <div>
      <ManageProducts
      renderSmallCard={false}
      allProductProp={true}
      defaultCategory="Ladies Footwear"
      sortBy="dateAdded"  // Assuming 'dateAdded' is the field that tracks when the product was added
      sortOrder="desc" 
      />
    </div>
  )
}

export default LadiesNewArrival
