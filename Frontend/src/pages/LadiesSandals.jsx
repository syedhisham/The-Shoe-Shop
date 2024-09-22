import React from 'react'
import ManageProducts from './ManageProducts'

const LadiesSandals = () => {
  return (
    <div>
      <ManageProducts
      renderSmallCard={false}
      allProductProp={true}
      defaultCategory="Ladies Footwear"
      defaultSubcategory="Sandals"
      />
    </div>
  )
}

export default LadiesSandals
