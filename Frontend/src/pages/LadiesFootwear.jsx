import React from 'react'
import ManageProducts from './ManageProducts'

const LadiesFootwear = () => {
  return (
    <div>
      <ManageProducts
      renderSmallCard={false}
      allProductProp={true}
      defaultCategory="Ladies Footwear"
      />
    </div>
  )
}

export default LadiesFootwear
