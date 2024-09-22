import React from 'react'
import ManageProducts from './ManageProducts'

const LadiesSlippers = () => {
  return (
    <div>
      <ManageProducts
      renderSmallCard={false}
      allProductProp={true}
      defaultCategory="Ladies Footwear"
      defaultSubcategory="Slippers"
      />
    </div>
  )
}

export default LadiesSlippers
