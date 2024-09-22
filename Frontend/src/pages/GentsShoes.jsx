import React from 'react'
import ManageProducts from './ManageProducts'

const GentsShoes = () => {
  return (
    <div>
       <ManageProducts
        renderSmallCard={false}
        allProductProp={true}
        defaultCategory="Gents Footwear"
        defaultSubcategory="Shoes"
      />
    </div>
  )
}

export default GentsShoes
