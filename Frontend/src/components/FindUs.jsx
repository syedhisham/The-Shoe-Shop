import React from 'react';
import MapComponent from './MapComponent';

const FindUs = () => {
  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-semibold text-gray-800 mb-4">Find Us</h2>
      <p className="text-gray-600 mb-6">
        We are located at the heart of the city. Visit us to explore our wide range of footwear for men and women. 
        Here’s where you can find us:
      </p>
      
      <div className="w-full h-64 md:h-96">
        <MapComponent />
      </div>

      <div className="mt-8 text-gray-600">
        <h3 className="text-2xl font-medium mb-2">Our Address</h3>
        <p>The Shoe Shop, Phool Gulab Road Street 1 Abbottabad</p>
        <h3 className="text-2xl font-medium mt-4 mb-2">Contact Us</h3>
        <p>Email: syedhishamshah27@gmail.com</p>
        <p>Phone: (123) 456-7890</p>
      </div>
    </div>
  );
};

export default FindUs;
