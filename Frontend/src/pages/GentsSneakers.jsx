import React from 'react'
import ManageProducts from './ManageProducts'

const GentsSneakers = () => {
  return (
    <div>
      <ManageProducts 
      renderSmallCard={false}
      allProductProp={true}
      defaultCategory="Gents Footwear"
      defaultSubcategory="Sneakers"
      />
    </div>
  )
}

export default GentsSneakers
