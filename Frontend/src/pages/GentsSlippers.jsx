import React from 'react'
import ManageProducts from './ManageProducts'

const GentsSlippers = () => {
  return (
    <div>
      <ManageProducts
      renderSmallCard={false}
      allProductProp={true}
      defaultCategory="Gents Footwear"
      defaultSubcategory="Slippers"
      />
    </div>
  )
}

export default GentsSlippers
