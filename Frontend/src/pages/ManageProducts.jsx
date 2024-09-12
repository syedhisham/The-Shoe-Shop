import React, { useEffect, useState } from "react";
import ProductCards from "../components/ProductCards";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SuccessToast from "../components/SuccessToast";
import ErrorToast from "../components/ErrorToast";
import axios from "axios";
import LoadingOverlay from "../components/LoadingOverlay";
import ProductUpdateForm from "./ProductUpdateForm";
import ProductUpdateImage from "./ProductUpdateImage";

const ManageProducts = ({ renderSmallCard = false, allProductProp }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [categoryParents, setCategoryParents] = useState([]);
  const [selectedCategoryParent, setSelectedCategoryParent] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedProductIdForImage, setSelectedProductIdForImage] =
    useState(null);

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
  const handleFetchImageByColor = async (productId, color) => {
    console.log("It is producd Id", productId, color);

    try {
      const response = await axios.get(
        `/api/products/image-by-color/${productId}/${color}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching image by color:", error);
      throw error;
    }
  };
  const handleProductUpdate = (productId) => {
    setSelectedProductId(productId);
  };

  const handleCloseUpdateForm = () => {
    setTimeout(() => {
      setSelectedProductId(null);
    }, 3000);
  };
  const handleUpdateClick = (productId) => {
    setSelectedProductIdForImage(productId);
  };
  const handleClosrUpdateClick = () => {
    setTimeout(() => {
      setSelectedProductIdForImage(null);
    }, 4000);
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
      {loading && <LoadingOverlay />}
      {selectedProductId && (
        <ProductUpdateForm
          productId={selectedProductId}
          onClose={handleCloseUpdateForm}
        />
      )}
      {selectedProductIdForImage && (
        <ProductUpdateImage
          productId={selectedProductIdForImage}
          onClose={handleClosrUpdateClick}
        />
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

      {renderSmallCard ? (
        ""
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCards
                key={product._id}
                product={product}
                onDelete={handleProductDelete}
                onUpdate={handleProductUpdate}
                onUpdateImage={handleUpdateClick}
                smallCard={true}
                productDetails={allProductProp}
                onFetchImageByColor={handleFetchImageByColor}
              />
            ))
          ) : (
            <p className="text-gray-700 text-base">No products available</p>
          )}
        </div>
      )}

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

export default ManageProducts;
