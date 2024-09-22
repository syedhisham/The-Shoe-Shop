import React from 'react'
import ManageProducts from './ManageProducts'

const LadiesShoes = () => {
  return (
    <div>
      <ManageProducts
      renderSmallCard={false}
      allProductProp={true}
      defaultCategory="Ladies Footwear"
      defaultSubcategory="Shoes"
      />
    </div>
  )
}

export default LadiesShoes
