import React, { useEffect, useState } from "react";
import ErrorToast from "./ErrorToast";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useLocation } from "react-router-dom";
import ManageProducts from "../pages/ManageProducts";
import ReviewsOnProduct from "./ReviewsOnProduct";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import LoadingOverlay from "./LoadingOverlay";

const DetailedProduct = () => {
  const location = useLocation();
  const { productId } = location.state || {};
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState("");
  const [colorImages, setColorImages] = useState([]);
  const [colorsWithImages, setColorsWithImages] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [isFilled, setIsFilled] = useState(false);
  const [inventoryStatus, setInventoryStatus] = useState({
    textColor: "",
    circleColor: "",
    text: "",
  });

  useEffect(() => {
    const fetchProductById = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `/api/products/product-by-id/${productId}`
        );
        const productDetails = response.data.data[0];
        setProduct(productDetails);

        const colorsResponse = await axios.get(
          `/api/products/colors-with-images/${productId}`
        );
        const fetchedColorsWithImages = colorsResponse.data.data;
        setColorsWithImages(fetchedColorsWithImages);

        if (fetchedColorsWithImages.length > 0) {
          const firstColor = fetchedColorsWithImages[0].color;

          const colorImagesResponse = await axios.get(
            `/api/products/product/${productId}?color=${firstColor}`
          );
          const fetchedImages = colorImagesResponse.data.data;

          setActiveImage(fetchedImages[0]?.imageUrl || "/default-image.jpg");

          setColorImages(fetchedImages);
        }
      } catch (error) {
        ErrorToast("Something went wrong while fetching the product");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductById();
    }
  }, [productId]);

  useEffect(() => {
    if (product) {
      let status = { textColor: "", circleColor: "", text: "" };
      if (product.stock < 15) {
        status = {
          textColor: "text-red-500",
          circleColor: "bg-red-500",
          text: "Limited stock available",
        };
      } else if (product.stock >= 15 && product.stock < 30) {
        status = {
          textColor: "text-yellow-500",
          circleColor: "bg-yellow-500",
          text: "Stock running low",
        };
      } else {
        status = {
          textColor: "text-green-500",
          circleColor: "bg-green-500",
          text: "In stock",
        };
      }
      setInventoryStatus(status);
    }
  }, [product]);

  const handleColorClick = async (color) => {
    try {
      const colorImagesResponse = await axios.get(
        `/api/products/product/${productId}?color=${color}`
      );
      const fetchedImages = colorImagesResponse.data.data;

      if (Array.isArray(fetchedImages)) {
        setActiveImage(fetchedImages[0]?.imageUrl || "/default-image.jpg");

        setColorImages(fetchedImages);
      } else {
        throw new Error("Fetched data is not an array");
      }
    } catch (error) {
      ErrorToast(
        "Something went wrong while fetching the images for the selected color"
      );
    }
  };

  const handleSizeClick = (size) => {
    setSelectedSize(size);
  };

  const sizes = product?.sizes ? JSON.parse(product.sizes[0]) : [];

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen">
        No product details available.
      </div>
    );
  }
  const handleHeartClick = () => {
    setIsFilled(!isFilled);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <ToastContainer />
      {loading && <LoadingOverlay />}
      <div className="flex flex-col lg:flex-row gap-6 mt-28 ">
        {/* Left Section: Image Gallery */}
        <div className="lg:w-1/2 flex flex-col gap-4">
          <div className="border rounded-lg overflow-hidden">
            <img
              className="w-full h-auto object-cover object-center md:h-[480px] transition-transform duration-300 ease-in-out hover:scale-105"
              src={activeImage}
              alt="Active"
            />
          </div>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
            {colorImages.map((image, index) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                <img
                  onClick={() => setActiveImage(image.imageUrl)}
                  src={image.imageUrl}
                  className="h-20 w-full cursor-pointer object-cover object-center transition-transform duration-300 ease-in-out hover:scale-105"
                  alt={`gallery-image-${index}`}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="lg:w-1/2 flex flex-col gap-4 p-4 border rounded-lg">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div
              className="cursor-pointer text-2xl transition-colors duration-300"
              onClick={handleHeartClick}
            >
              {isFilled ? (
                <FaHeart className="text-red-600" />
              ) : (
                <FaRegHeart className="text-black" />
              )}
            </div>
          </div>
          <p className="text-xl font-semibold text-gray-700 mb-2">
            Price: Rs {product.price}
          </p>
          <p className="text-md text-gray-600 mb-2">
            Stock: <span className="font-semibold">{product.stock}</span>
          </p>
          {/* Inventory status */}
          <div className="flex items-center">
            <div
              className={`w-2 h-2 rounded-full ${inventoryStatus.circleColor}`}
            ></div>
            <p className={`ml-2 ${inventoryStatus.textColor}`}>
              {inventoryStatus.text}
            </p>
          </div>

          <p className="text-md text-gray-600 mb-4">
            Description: {product.description}
          </p>

          <div className="mt-4">
            <h2 className="text-lg font-semibold mb-2">Available Colors</h2>
            <div className="flex flex-wrap gap-4">
              {colorsWithImages.map(({ color, imageUrl }) => (
                <div
                  key={color}
                  className="flex flex-col items-center cursor-pointer"
                  onClick={() => handleColorClick(color)}
                >
                  <img
                    src={imageUrl}
                    alt={color}
                    className="w-16 h-16 rounded-lg object-cover mb-2"
                  />
                  <div
                    className="w-16 h-1 -mt-3 rounded-br-3xl rounded-bl-3xl"
                    style={{ backgroundColor: color }}
                  ></div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <h2 className="text-lg font-semibold mb-2">Available Sizes</h2>
            <div className="flex gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => handleSizeClick(size)}
                  className={`py-[8px] px-8 rounded-lg border transition-colors duration-200 ${
                    selectedSize === size
                      ? "bg-black text-white"
                      : "bg-white text-gray-700"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <button className="bg-black hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition duration-200 mt-4">
            Add to Cart
          </button>
        </div>
      </div>
      <div className="mt-5 mb-5">
        <p className="text-2xl font-semibold ">Rate the Product</p>
        <ReviewsOnProduct />
      </div>
      <div className="manageProducts">
        <p className="text-3xl font-semibold">Suggested Products</p>
        <ManageProducts
          renderSmallCard={false}
          allProductProp={true}
          detailedProductCard={false}
        />
      </div>
    </div>
  );
};

export default DetailedProduct;
