import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Input,
  Textarea,
  Select,
  Option,
  Button,
} from "@material-tailwind/react";
import SuccessToast from "../components/SuccessToast";
import ErrorToast from "../components/ErrorToast";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingOverlay from "./LoadingOverlay";

const API_URL = "/api/products";

const AddProductForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    subcategory: "",
    price: "",
    stock: "",
    sizes: [],
    availableColors: [],
  });
  const [errors, setErrors] = useState({});
  const [imageColorPairs, setImageColorPairs] = useState([
    { image: null, color: "" },
    { image: null, color: "" },
  ]);
  const [selectedFiles, setSelectedFiles] = useState([null, null]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSizesChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      sizes: e.target.value.split(",").map((size) => size.trim()),
    }));
  };

  const handleAvailableColorsChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      availableColors: e.target.value.split(",").map((color) => color.trim()),
    }));
  };
  const handleCategorySelect = (category) => {
    setFormData((prevState) => ({
      ...prevState,
      category,
      subcategory: "",
    }));
  };

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

    if (!formData.name.trim()) newErrors.name = "Product name is required.";
    if (!formData.category.trim()) newErrors.category = "Category is required.";
    if (!formData.subcategory.trim())
      newErrors.subcategory = "Sub-Category is required.";

    if (!formData.price || isNaN(formData.price) || formData.price <= 0)
      newErrors.price = "Price must be a positive number.";

    if (!formData.stock || isNaN(formData.stock) || formData.stock < 0)
      newErrors.stock = "Stock must be a non-negative number.";

    if (!formData.sizes.length)
      newErrors.sizes = "At least one size is required.";

    if (!formData.availableColors.length)
      newErrors.availableColors = "At least one color is required.";

    if (imageColorPairs.some((pair) => !pair.image || !pair.color))
      newErrors.imageColorPairs = "Each image must have a corresponding color.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addProduct = async (productData) => {
    try {
      const formDataToSend = new FormData();

      formDataToSend.append("name", productData.name);
      formDataToSend.append("description", productData.description);
      formDataToSend.append("category", productData.category);
      formDataToSend.append("subcategory", productData.subcategory);
      formDataToSend.append("price", productData.price);
      formDataToSend.append("stock", productData.stock);
      formDataToSend.append("sizes", JSON.stringify(productData.sizes)); // Send sizes
      formDataToSend.append(
        "availableColors",
        JSON.stringify(productData.availableColors)
      );

      imageColorPairs.forEach((pair) => {
        if (pair.image) formDataToSend.append("images", pair.image);
        formDataToSend.append("colors", pair.color);
      });

      const response = await axios.post(
        `${API_URL}/add-product`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error(
        "Error adding product:",
        error.response?.data || error.message
      );
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!validateForm()) return;

    try {
      await addProduct(formData);
      SuccessToast("Product added successfully!");

      setFormData({
        name: "",
        description: "",
        category: "",
        subcategory: "",
        price: "",
        stock: "",
        sizes: [],
        availableColors: [],
      });

      setImageColorPairs([
        { image: null, color: "" },
        { image: null, color: "" },
      ]);
      setSelectedFiles([null, null]);
      setErrors({});
    } catch (error) {
      ErrorToast("Error adding product. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const availableSubcategories =
    formData.category === "Ladies Footwear"
      ? ["Sandals", "Slippers", "Shoes", "Sneakers", "Pumps"]
      : ["Sandals", "Slippers", "Shoes", "Sneakers"];

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-lg rounded-lg">
      {loading && <LoadingOverlay />}
      <h2 className="text-2xl font-bold mb-6 text-center">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="text"
            name="name"
            id="name"
            className="w-full px-4 py-2"
            onChange={handleChange}
            variant="outlined"
            label="Product Name"
            size="lg"
            placeholder="Name of the product"
            value={formData.name}
            required
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        <div>
          <Textarea
            name="description"
            id="description"
            rows="3"
            className="w-full px-4 py-2"
            onChange={handleChange}
            variant="outlined"
            label="Description"
            size="lg"
            value={formData.description}
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description}</p>
          )}
        </div>

        {/* Category Selection as Buttons */}
        <div className="flex space-x-4 mb-4">
          <Button
            type="Button"
            size="lg"
            onClick={() => handleCategorySelect("Gents Footwear")}
            className={`px-4 py-2 rounded-md  hover:bg-gray-400 text-black ${
              formData.category === "Gents Footwear"
                ? "bg-gray-300"
                : "bg-gray-400"
            }`}
          >
            Gents Footwear
          </Button>
          <Button
            type="Button"
            size="lg"
            onClick={() => handleCategorySelect("Ladies Footwear")}
            className={`px-4 py-2 rounded-md  hover:bg-gray-400 text-black ${
              formData.category === "Ladies Footwear"
                ? "bg-gray-300"
                : "bg-gray-400"
            }`}
          >
            Ladies Footwear
          </Button>
        </div>
        {errors.category && (
          <p className="text-red-500 text-sm">{errors.category}</p>
        )}

        <div>
          <Select
            label="Select Subcategory"
            name="subcategory"
            value={formData.subcategory}
            onChange={(e) =>
              handleChange({ target: { name: "subcategory", value: e } })
            }
            variant="outlined"
            size="lg"
          >
            {availableSubcategories.map((subcategory) => (
              <Option key={subcategory} value={subcategory}>
                {subcategory}
              </Option>
            ))}
          </Select>
          {errors.subcategory && (
            <p className="text-red-500 text-sm">{errors.subcategory}</p>
          )}
        </div>

        <div>
          <Input
            type="number"
            name="price"
            id="price"
            className="w-full px-4 py-2"
            onChange={handleChange}
            variant="outlined"
            label="Price"
            size="lg"
            placeholder="Price of the product"
            value={formData.price}
            min="0"
            required
          />
          {errors.price && (
            <p className="text-red-500 text-sm">{errors.price}</p>
          )}
        </div>

        <div>
          <Input
            type="number"
            name="stock"
            id="stock"
            className="w-full px-4 py-2"
            onChange={handleChange}
            variant="outlined"
            label="Stock"
            size="lg"
            placeholder="Stock of the product"
            value={formData.stock}
            min="0"
            required
          />
          {errors.stock && (
            <p className="text-red-500 text-sm">{errors.stock}</p>
          )}
        </div>

        <div>
          <Input
            type="text"
            name="sizes"
            id="sizes"
            className="w-full px-4 py-2"
            onChange={handleSizesChange}
            variant="outlined"
            label="Sizes (Comma Separated)"
            size="lg"
            placeholder="e.g. 39, 42, 45"
            value={formData.sizes.join(", ")}
            required
          />
          {errors.sizes && (
            <p className="text-red-500 text-sm">{errors.sizes}</p>
          )}
        </div>

        <div>
          <Input
            type="text"
            name="availableColors"
            id="availableColors"
            className="w-full px-4 py-2"
            onChange={handleAvailableColorsChange}
            variant="outlined"
            label="Available Colors (Comma Separated)"
            size="lg"
            placeholder="e.g., Red, Blue, Green"
            value={formData.availableColors.join(", ")}
            required
          />
          {errors.availableColors && (
            <p className="text-red-500 text-sm">{errors.availableColors}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Images with Colors{" "}
            <span className="text-blue-500">
              (At least two images can be selected)
            </span>
          </label>
          {imageColorPairs.map((pair, index) => (
            <div key={index} className="relative mb-4">
              {selectedFiles[index] && (
                <div className="relative">
                  <img
                    src={selectedFiles[index]}
                    alt={`Image Preview ${index + 1}`}
                    className="w-80 h-60 object-cover rounded-md border mb-5"
                  />
                  <Button
                    type="Button"
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
                  </Button>
                </div>
              )}

              {!selectedFiles[index] && (
               <Button  className="flex items-center gap-3 bg-gray-300 text-black hover:bg-gray-400 mb-2" type="button" size="sm">
               <label className="flex items-center gap-3 cursor-pointer">
                 <input
                   type="file"
                   className="hidden"
                   onChange={(e) => handleFileChange(index, e)} 
                 />
                 <svg
                   xmlns="http://www.w3.org/2000/svg"
                   fill="none"
                   viewBox="0 0 24 24"
                   strokeWidth={2}
                   stroke="currentColor"
                   className="h-5 w-5"
                 >
                   <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                   />
                 </svg>
                 Upload Files
               </label>
             </Button>
             

                // <input
                //   type="file"
                //   accept="image/*"
                //   onChange={(e) => handleFileChange(index, e)}
                //   className="w-full mt-2 mb-2"
                // />
              )}
              <Input
                type="text"
                value={pair.color}
                onChange={(e) => handleColorChange(index, e.target.value)}
                className="w-full px-4 py-2"
                variant="outlined"
                label="Color"
                size="lg"
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
          <Button
            type="Button"
            onClick={handleAddImageColorPair}
            className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded-md transition-colors"
          >
            Add Another Image
          </Button>
        </div>
        <div>
          <Button
            type="submit"
            className="w-full bg-black hover:bg-gray-700 text-white py-2 px-4 rounded-md transition-colors"
          >
            Add Product
          </Button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddProductForm;
