import React, { useEffect, useState } from "react";
import { Carousel, IconButton } from "@material-tailwind/react";
import { FaEdit } from "react-icons/fa";

const ProductCards = ({
  product,
  onDelete,
  onUpdate,
  onUpdateImage,
  onFetchImageByColor,
  onGetProductId,
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
          setDisplayedImages(["/default-image.jpg"]);
          setCurrentImageIndex(0);
        }
      } catch (error) {
        console.error("Error fetching image by color:", error);
        setDisplayedImages(["/default-image.jpg"]);
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
              <Carousel
                className="rounded-lg relative"
                loop
                autoplay
                navigation={({ setActiveIndex, activeIndex, length }) => (
                  <div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2">
                    {new Array(length).fill("").map((_, i) => (
                      <span
                        key={i}
                        className={`block h-1 cursor-pointer rounded-2xl transition-all content-[''] ${
                          activeIndex === i ? "w-8 bg-black" : "w-4 bg-gray-600"
                        }`}
                        onClick={() => setActiveIndex(i)}
                      />
                    ))}
                  </div>
                )}
                prevArrow={({ handlePrev }) => (
                  <IconButton
                    variant="text"
                    color="white"
                    size="lg"
                    onClick={handlePrev}
                    className="!absolute top-2/4 left-4 -translate-y-2/4"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                      />
                    </svg>
                  </IconButton>
                )}
                nextArrow={({ handleNext }) => (
                  <IconButton
                    variant="text"
                    color="white"
                    size="lg"
                    onClick={handleNext}
                    className="!absolute top-2/4 !right-4 -translate-y-2/4"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </IconButton>
                )}
              >
                {product.images.length > 0 ? (
                  product.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Product Image ${index + 1}`}
                        className="h-80 w-full object-cover"
                      />
                      <FaEdit
                        className="absolute bottom-4 right-4 text-gray-900 text-xl cursor-pointer"
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
                      className="absolute bottom-4 right-4 text-white text-xl cursor-pointer"
                      onClick={() => onUpdateImage(product._id)}
                    />
                  </div>
                )}
              </Carousel>
            </div>
          ) : (
            <div
              className="max-w-sm rounded-lg shadow-lg m-4"
              onClick={() => onGetProductId(product._id)}
            >
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
            <p
              className="text-sm mb-2 flex items-center"
              onClick={() => onGetProductId(product._id)}
            >
              {product.name}
              <span
                className="inline-block mx-2 w-5 border-t-2 border-gray-400"
                onClick={() => onGetProductId(product._id)}
              ></span>
              {product.price}
            </p>

            {!productDetails && (
              <div className="p-6 bg-white border rounded-lg">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700 w-36">
                      Stock:
                    </span>
                    <p className="text-gray-700 text-base">{product.stock}</p>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700 w-36">
                      Sizes:
                    </span>
                    <p className="text-gray-700 text-base">
                      {product.sizes ? product.sizes.join(", ") : "N/A"}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium text-gray-600 w-36">
                      Created At:
                    </span>
                    <p className="text-gray-600 text-sm">
                      {formatDate(product.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium text-gray-600 w-36">
                      Updated At:
                    </span>
                    <p className="text-gray-600 text-sm">
                      {formatDate(product.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
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
