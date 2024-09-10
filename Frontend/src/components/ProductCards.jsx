import React, { useEffect, useState } from "react";
import { Carousel, Spinner } from "@material-tailwind/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SuccessToast from "./SuccessToast";
import ErrorToast from "./ErrorToast";
import axios from "axios";

const ProductCard = ({ product, onDelete }) => {
  if (!product.images || !Array.isArray(product.images)) {
    return null;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Invalid date" : date.toLocaleDateString();
  };
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg m-4">
      <div className="p-4">
        <Carousel className="rounded-lg">
          {product.images.length > 0 ? (
            product.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Product Image ${index + 1}`}
                className="h-48 w-full object-cover"
              />
            ))
          ) : (
            <img
              src="/default-image.jpg"
              alt="Default Image"
              className="h-48 w-full object-cover"
            />
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
      <div className="px-6 py-4">
        <button
          onClick={() => onDelete(product._id)}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [totalPages, setTotalPages] = useState(1); // State for total pages
  const [loading, setLoading] = useState(false);
  const [categoryParents, setCategoryParents] = useState([]);
  const [selectedCategoryParent, setSelectedCategoryParent] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/products/all-products?page=${currentPage}&limit=10`
      );
      if (response.data && response.data.data) {
        const productDetails = response.data.data.ProductDetails || [];

        setProducts(productDetails);
        setFilteredProducts(productDetails);
        setTotalPages(response.data.data.TotalPages || 1);

        const uniqueCategories = [
          ...new Set(productDetails.map((product) => product.categoryName)),
        ];
        const uniqueCategoryParents = [
          ...new Set(
            productDetails.map((product) => product.categoryParentName)
          ),
        ];
        setCategories(uniqueCategories);
        setCategoryParents(uniqueCategoryParents);
      } else {
        console.error("Unexpected API response format");
      }
    } catch (error) {
      ErrorToast("Error fetching products: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  const handleCategoryParentChange = (categoryParent) => {
    setSelectedCategoryParent(categoryParent);

    const filteredByParent =
      categoryParent === ""
        ? products
        : products.filter(
            (product) => product.categoryParentName === categoryParent
          );

    setFilteredProducts(
      selectedCategory === ""
        ? filteredByParent
        : filteredByParent.filter(
            (product) => product.categoryName === selectedCategory
          )
    );
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);

    if (category === "") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter((product) => product.categoryName === category)
      );
    }
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    filterProducts(selectedCategoryParent, selectedCategory, term);
  };

  const filterProducts = (categoryParent, category, searchTerm) => {
    let filtered = products;
    if (categoryParent) {
      filtered = filtered.filter(
        (product) => product.categoryParentName === categoryParent
      );
    }
    if (category) {
      filtered = filtered.filter(
        (product) => product.categoryName === category
      );
    }
    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredProducts(filtered);
  };

  const handleProductDelete = async (productId) => {
    setLoading(true);
    try {
      await axios.delete(`/api/products/remove-product/${productId}`);

      setFilteredProducts(
        filteredProducts.filter((product) => product._id !== productId)
      );
      setProducts(products.filter((product) => product._id !== productId));
      SuccessToast("Product deleted successfully");
    } catch (error) {
      ErrorToast("Failed to delete product: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <ToastContainer />
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-60 z-50 backdrop-blur-sm">
          <div className="flex flex-col items-center">
            <div className="relative flex items-center justify-center">
              <div className="w-16 h-16 border-t-4 border-blue-800 border-solid rounded-full animate-spin"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold text-lg">
                Loading...
              </div>
            </div>
            <p className="mt-2 text-white text-lg">Please wait...</p>
          </div>
        </div>
      )}

      <div className="my-4">
        <input
          type="text"
          placeholder="Search by product name"
          value={searchTerm}
          onChange={handleSearchChange}
          className="border border-gray-300 rounded p-2 w-full"
        />
      </div>

      <div className="my-4 flex flex-wrap gap-4">
        <button
          onClick={() => handleCategoryParentChange("")}
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${selectedCategoryParent === "" ? "bg-blue-700" : ""}`}
        >
          All Parent Categories
        </button>
        {categoryParents.map((parent) => (
          <button
            key={parent}
            onClick={() => handleCategoryParentChange(parent)}
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${selectedCategoryParent === parent ? "bg-blue-700" : ""}`}
          >
            {parent}
          </button>
        ))}
      </div>
      <div className="my-4">
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="border border-gray-300 rounded p-2"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onDelete={handleProductDelete}
            />
          ))
        ) : (
          <p className="text-gray-700 text-base">No products available</p>
        )}
      </div>

      <div className="flex justify-center items-center mt-8">
        <button
          onClick={handlePreviousPage}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <p className="mx-4">
          Page {currentPage} of {totalPages}
        </p>
        <button
          onClick={handleNextPage}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductList;
