import React, { useState, useEffect } from "react";
import axios from "axios";
import ErrorToast from "../components/ErrorToast";
import SuccessToast from "../components/SuccessToast";
import LoadingOverlay from "../components/LoadingOverlay";

const ProductUpdateForm = ({ productId, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    sizes: [],
    availableColors: [],
    category: "",
    stock: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axios.get(
          `/api/products/product-by-id/${productId}`
        );
        const productData = response.data;
        setFormData({
          name: productData.name,
          description: productData.description,
          price: productData.price,
          sizes: Array.isArray(productData.sizes) ? productData.sizes : [],
          availableColors: Array.isArray(productData.availableColors)
            ? productData.availableColors
            : [],
          category: productData.category || "",
          stock: productData.stock,
        });
      } catch (err) {
        setError("Failed to fetch product data.");
      }
    };

    fetchProductData();
  }, [productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleArrayChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value ? value.split(",").map((item) => item.trim()) : [],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axios.patch(
        `/api/products/update-product-details/${productId}`,
        formData
      );
      SuccessToast("Product updated successfully");
      onClose();
    } catch (err) {
      setError("Failed to update product.");
      ErrorToast("Failed to update product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto bg-white rounded shadow-lg">
      {loading && <LoadingOverlay />}
      <h2 className="text-xl font-bold mb-4">Update Product</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Product Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="border border-gray-300 rounded p-2 w-full"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="border border-gray-300 rounded p-2 w-full"
            rows="4"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="price"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="border border-gray-300 rounded p-2 w-full"
            step="0.01"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="sizes"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Sizes (comma separated)
          </label>
          <input
            type="text"
            id="sizes"
            name="sizes"
            value={(formData.sizes || []).join(", ")}
            onChange={handleArrayChange}
            className="border border-gray-300 rounded p-2 w-full"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="availableColors"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Available Colors (comma separated)
          </label>
          <input
            type="text"
            id="availableColors"
            name="availableColors"
            value={(formData.availableColors || []).join(", ")}
            onChange={handleArrayChange}
            className="border border-gray-300 rounded p-2 w-full"
          />
        </div>

        {/* Category Field */}
        <div className="mb-4">
          <label
            htmlFor="category"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Category
          </label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="border border-gray-300 rounded p-2 w-full"
          />
        </div>

        {/* Stock Field */}
        <div className="mb-4">
          <label
            htmlFor="stock"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Stock
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            className="border border-gray-300 rounded p-2 w-full"
          />
        </div>

        <div className="flex justify-between">
          <button
            className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductUpdateForm;
