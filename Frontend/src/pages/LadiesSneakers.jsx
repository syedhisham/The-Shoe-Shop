import React from 'react'
import ManageProducts from './ManageProducts'

const LadiesSneakers = () => {
  return (
    <div>
      <ManageProducts
      renderSmallCard={false}
      allProductProp={true}
      defaultCategory="Ladies Footwear"
      defaultSubcategory="Sneakers"
      />
    </div>
  )
}

export default LadiesSneakers
