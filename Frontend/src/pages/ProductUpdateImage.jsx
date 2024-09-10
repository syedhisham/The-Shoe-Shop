import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "@material-tailwind/react";
import SuccessToast from "../components/SuccessToast";
import ErrorToast from "../components/ErrorToast";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingOverlay from "../components/LoadingOverlay";

const API_URL = "/api/products"; // Adjust if necessary for the specific endpoint handling image-color pairs

const ProductUpdateImage = ({productId, onClose}) => {
  const [imageColorPairs, setImageColorPairs] = useState([
    { image: null, color: "" },
    { image: null, color: "" }, // Initial pairs
  ]);
  const [selectedFiles, setSelectedFiles] = useState([null, null]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true)
        const response = await axios.get(
          `/api/products/product-by-id/${productId}`
        );
        
      } catch (err) {
        ErrorToast("Failed to fetch product data.");
      }
      finally {
        setLoading(false)
      }
    };

    fetchProductData();
  }, [productId]);

  const handleFileChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const newImageColorPairs = [...imageColorPairs];
      newImageColorPairs[index].image = file;
      setImageColorPairs(newImageColorPairs);

      const reader = new FileReader();
      reader.onload = () => {
        setSelectedFiles((prev) => {
          const newFiles = [...prev];
          newFiles[index] = reader.result;
          return newFiles;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (index) => {
    setImageColorPairs((prev) => prev.filter((_, i) => i !== index));
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleColorChange = (index, color) => {
    const newImageColorPairs = [...imageColorPairs];
    newImageColorPairs[index].color = color;
    setImageColorPairs(newImageColorPairs);
  };

  const handleAddImageColorPair = () => {
    setImageColorPairs([...imageColorPairs, { image: null, color: "" }]);
    setSelectedFiles([...selectedFiles, null]);
  };

  const validateForm = () => {
    let newErrors = {};

    if (imageColorPairs.some((pair) => !pair.image || !pair.color))
      newErrors.imageColorPairs = "Each image must have a corresponding color.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addImageColorPairs = async (pairs) => {
    try {
      const formDataToSend = new FormData();

      pairs.forEach((pair) => {
        if (pair.image) formDataToSend.append("images", pair.image);
        formDataToSend.append("colors", pair.color);
      });

      const response = await axios.patch(
        `${API_URL}/update-product-images/${productId}`, 
        formDataToSend,
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error adding image-color pairs:",
        error.response?.data || error.message
      );
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    if (!validateForm()) return;
    
    try {
      await addImageColorPairs(imageColorPairs);
      SuccessToast("Image-color pairs added successfully!");
      onClose()

      setImageColorPairs([
        { image: null, color: "" },
        { image: null, color: "" },
      ]);
      setSelectedFiles([null, null]);
      setErrors({});
    } catch (error) {
      ErrorToast("Error adding image-color pairs. Please try again.");
    }
    finally{
    setLoading(false)

    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-lg rounded-lg">
    {loading && <LoadingOverlay />}
      <h2 className="text-2xl font-bold mb-6 text-center">Add Image-Color Pairs</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {imageColorPairs.map((pair, index) => (
          <div key={index} className="relative mb-4">
            {/* Image Preview */}
            {selectedFiles[index] && (
              <div className="relative">
                <img
                  src={selectedFiles[index]}
                  alt={`Image Preview ${index + 1}`}
                  className="w-80 h-60 object-cover rounded-md border mb-5"
                />
                <button
                  type="button"
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-lg"
                  onClick={() => handleRemoveImage(index)}
                >
                  <svg
                    className="w-6 h-6 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>
            )}

            {!selectedFiles[index] && (
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(index, e)}
                className="w-full mt-2 mb-2"
              />
            )}
            <Input
              type="text"
              value={pair.color}
              onChange={(e) => handleColorChange(index, e.target.value)}
              className="w-full px-4 py-2"
              variant="outlined"
              label="Color"
              size="lg"
              color="blue"
              placeholder="Color"
              required
            />
            {errors[`imageColorPairs.${index}.color`] && (
              <p className="text-red-500 text-sm">
                {errors[`imageColorPairs.${index}.color`]}
              </p>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddImageColorPair}
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
        >
          Add Another Image
        </button>

        <div className="flex justify-between">
        <button
          className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className=" bg-green-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
          >
            Update Images
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default ProductUpdateImage;
