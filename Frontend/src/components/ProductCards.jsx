import React from "react";
import { Carousel } from "@material-tailwind/react";
import { FaEdit } from "react-icons/fa";

const ProductCards = ({ product, onDelete, onUpdate, onUpdateImage }) => {
  if (!product.images || !Array.isArray(product.images)) {
    return null;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Invalid date" : date.toLocaleDateString();
  };
  return (
    <div className="relative max-w-sm rounded overflow-hidden shadow-lg m-4">
      <div className="p-4">
        <Carousel className="rounded-lg relative">
          {product.images.length > 0 ? (
            product.images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image}
                  alt={`Product Image ${index + 1}`}
                  className="h-48 w-full object-cover"
                />
                <FaEdit
                  className="absolute bottom-4 right-4 text-white text-2xl cursor-pointer"
                  onClick={() => onUpdateImage(product._id)}
                />
              </div>
            ))
          ) : (
            <div className="relative">
              <img
                src="/default-image.jpg"
                alt="Default Image"
                className="h-48 w-full object-cover"
              />
              <FaEdit
                className="absolute bottom-4 right-4 text-white text-2xl cursor-pointer"
                onClick={() => onUpdateImage(product._id)}
              />
            </div>
          )}
        </Carousel>
      </div>
      <div className="px-6 py-4">
        <h2 className="font-bold text-xl mb-2">{product.name}</h2>
        <p className="text-gray-700 text-base">
          Category: {product.categoryName}
        </p>
        <p className="text-gray-700 text-base">
          Category Parent Name: {product.categoryParentName}
        </p>
        <p className="text-gray-700 text-base">Stock: {product.stock}</p>
        <p className="text-gray-700 text-base">
          Sizes: {product.sizes ? product.sizes.join(", ") : "N/A"}
        </p>
        <p className="text-gray-600 text-sm">
          Created At: {formatDate(product.createdAt)}
        </p>
        <p className="text-gray-600 text-sm">
          Updated At: {formatDate(product.updatedAt)}
        </p>
      </div>
      <div className="flex px-6 py-4 justify-between">
        <button
          onClick={() => onDelete(product._id)}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Delete
        </button>
        <button
          onClick={() => onUpdate(product._id)}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default ProductCards;
