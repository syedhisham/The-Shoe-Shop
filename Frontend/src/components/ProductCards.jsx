import React, { useEffect, useState } from "react";
import { Carousel } from "@material-tailwind/react";
import { FaEdit } from "react-icons/fa";

const ProductCards = ({
  product,
  onDelete,
  onUpdate,
  onUpdateImage,
  onFetchImageByColor,
  smallCard = false,
  productDetails = false,
}) => {
  if (!product.images || !Array.isArray(product.images)) {
    return null;
  }

  const colorsString = product.colors[0];
  const [selectedColor, setSelectedColor] = useState("");
  const [displayedImages, setDisplayedImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  let colorsArray = [];
  if (colorsString && typeof colorsString === "string") {
    try {
      colorsArray = JSON.parse(colorsString);
    } catch (error) {
      console.error("Error parsing colors string:", error);
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Invalid date" : date.toLocaleDateString();
  };

  const handleColorChange = async (color) => {
    setSelectedColor(color);
    setFadeIn(false);

    setTimeout(async () => {
      try {
        const response = await onFetchImageByColor(product._id, color);
        if (response.success && response.data.length > 0) {
          setDisplayedImages(response.data.map((img) => img.imageUrl));
          setCurrentImageIndex(0);
        } else {
          setDisplayedImages(["/default-image.jpg"]); // Fallback image
          setCurrentImageIndex(0);
        }
      } catch (error) {
        console.error("Error fetching image by color:", error);
        setDisplayedImages(["/default-image.jpg"]); // Fallback image
        setCurrentImageIndex(0);
      } finally {
        setFadeIn(true);
      }
    }, 300);
  };

  const handleMouseEnter = () => {
    if (displayedImages.length > 1) {
      setFadeIn(false);

      setTimeout(() => {
        setCurrentImageIndex(
          (prevIndex) => (prevIndex + 1) % displayedImages.length
        );
        setFadeIn(true);
      }, 300);
    }
  };

  useEffect(() => {
    if (product.images.length > 0) {
      setDisplayedImages(product.images);
      setCurrentImageIndex(0);
    }
  }, [product.images]);

  return (
    <>
      {smallCard ? (
        <div className="relative max-w-sm rounded overflow-hidden shadow-lg m-4">
          {!productDetails ? (
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
          ) : (
            <div className="max-w-sm rounded-lg shadow-lg m-4">
              <div
                id="imageContainer"
                className={`image-container ${fadeIn ? "fade-in" : "fade-out"}`}
                onMouseEnter={handleMouseEnter}
              >
                <img
                  src={
                    displayedImages[currentImageIndex] || "/default-image.jpg"
                  }
                  alt="Selected Product Image"
                  className="h-48 w-full object-cover cursor-pointer"
                />
              </div>
            </div>
          )}
          <div className="px-6 py-4">
            {productDetails && (
              <div className="flex gap-2 mb-4">
                {colorsArray &&
                  colorsArray.map((color) => (
                    <button
                      key={color}
                      onClick={() => handleColorChange(color)}
                      className={`w-6 h-[0.5rem]`}
                      style={{
                        backgroundColor: color,
                        border:
                          selectedColor === color ? "2px solid white" : "none",
                      }}
                    />
                  ))}
              </div>
            )}
            <p className="text-sm mb-2 flex items-center">
              {product.name}
              <span className="inline-block mx-2 w-5 border-t-2 border-gray-400"></span>
              {product.price}
            </p>

            {!productDetails && (
              <>
                <p className="text-gray-700 text-base">
                  Category: {product.categoryName}
                </p>
                <p className="text-gray-700 text-base">
                  Category Parent Name: {product.categoryParentName}
                </p>
                <p className="text-gray-700 text-base">
                  Stock: {product.stock}
                </p>
                <p className="text-gray-700 text-base">
                  Sizes: {product.sizes ? product.sizes.join(", ") : "N/A"}
                </p>
                <p className="text-gray-700 text-base">
                  Description: {product.description}
                </p>
                <p className="text-gray-600 text-sm">
                  Created At: {formatDate(product.createdAt)}
                </p>
                <p className="text-gray-600 text-sm">
                  Updated At: {formatDate(product.updatedAt)}
                </p>
              </>
            )}
          </div>
          {!productDetails && (
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
          )}
        </div>
      ) : (
        "Testing"
      )}
    </>
  );
};

export default ProductCards;
