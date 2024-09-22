import React from 'react'
import ManageProducts from './ManageProducts'

const LadiesPumps = () => {
  return (
    <div>
      <ManageProducts 
      renderSmallCard={false}
      allProductProp={true}
      defaultCategory="Ladies Footwear"
      defaultSubcategory="Pumps"
      />
    </div>
  )
}

export default LadiesPumps
