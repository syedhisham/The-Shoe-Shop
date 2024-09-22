import React from 'react'
import ManageProducts from './ManageProducts'

const GentsFootwear = () => {
  return (
    <div>
      <ManageProducts
      renderSmallCard={false}
      allProductProp={true}
      defaultCategory="Gents Footwear"
      />
    </div>
  )
}

export default GentsFootwear
