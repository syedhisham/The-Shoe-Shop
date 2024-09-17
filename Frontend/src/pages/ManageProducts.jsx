import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import ProductCards from "../components/ProductCards";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SuccessToast from "../components/SuccessToast";
import ErrorToast from "../components/ErrorToast";
import LoadingOverlay from "../components/LoadingOverlay";
import ProductUpdateForm from "./ProductUpdateForm";
import ProductUpdateImage from "./ProductUpdateImage";
import { useNavigate } from "react-router-dom";
import { ProductContext } from "../context/ProductContext";
import {
  Button,
  IconButton,
  Input,
  Select,
  Option,
} from "@material-tailwind/react";
import { CiSearch } from "react-icons/ci";

const ManageProducts = ({
  renderSmallCard = false,
  allProductProp,
  detailedProductCard = true,
}) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedProductIdForImage, setSelectedProductIdForImage] =
    useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { setProductId } = useContext(ProductContext);
  const navigate = useNavigate();

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

        const categoriesSet = new Set(productDetails.map((p) => p.category));
        setCategories(["All", ...categoriesSet]);

        if (selectedCategory !== "All") {
          const subcategoriesSet = new Set(
            productDetails
              .filter((p) => p.category === selectedCategory)
              .map((p) => p.subcategory)
          );
          setSubcategories([...subcategoriesSet]);
        }
      } else {
        console.error("Unexpected API response format");
      }
    } catch (error) {
      ErrorToast("Error fetching products: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    filterProducts();
  }, [searchTerm, selectedCategory, selectedSubcategory, products]);

  const filterProducts = () => {
    let filtered = products;

    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    if (selectedSubcategory) {
      filtered = filtered.filter(
        (product) => product.subcategory === selectedSubcategory
      );
    }

    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategory("");
    if (category === "All") {
      setSubcategories([]);
    } else {
      const subcategoriesSet = new Set(
        products
          .filter((p) => p.category === category)
          .map((p) => p.subcategory)
      );
      setSubcategories([...subcategoriesSet]);
    }
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

  const handleProductUpdate = (productId) => setSelectedProductId(productId);

  const handleCloseUpdateForm = () => setSelectedProductId(null);

  const handleUpdateClick = (productId) =>
    setSelectedProductIdForImage(productId);

  const handleCloseUpdateClick = () => setSelectedProductIdForImage(null);

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

  const handleDetailedProduct = (productId, color) => {
    if (!productId) return;

    setProductId(productId);
    navigate(`/detailedProduct/${productId}?color=${color}`);
  };

  const handleSearchClick = () => setIsSearchOpen(!isSearchOpen);

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
          onClose={handleCloseUpdateClick}
        />
      )}

      {detailedProductCard && (
        <>
          <div className="my-4 flex items-center">
            <IconButton
              className="mt-4"
              variant="outlined"
              onClick={handleSearchClick}
            >
              <CiSearch
                className="cursor-pointer text-gray-600 transition-transform duration-300 hover:scale-110"
                style={{ color: "black", fontSize: "2.5em" }}
                size={24}
              />
            </IconButton>

            <div
              className={`transition-all duration-500 ease-in-out ml-2 pt-5 overflow-hidden ${
                isSearchOpen ? "w-full" : "w-0"
              }`}
            >
              <Input
                variant="standard"
                type="text"
                label="Type to search"
                placeholder="Search by product name"
                value={searchTerm}
                onChange={handleSearchChange}
                className={`pl-4 pr-4 py-2 w-full shadow-sm transition duration-300 transform ${
                  isSearchOpen ? "scale-100" : "scale-0"
                }`}
              />
            </div>
          </div>

          <div className="my-4 flex gap-2">
            <Button
              variant="outlined"
              onClick={() => handleCategoryChange("All")}
              className={selectedCategory === "All" ? "bg-gray-300" : ""}
            >
              All Categories
            </Button>
            {categories
              .filter((category) => category !== "All")
              .map((category) => (
                <Button
                  key={category}
                  variant="outlined"
                  onClick={() => handleCategoryChange(category)}
                  className={selectedCategory === category ? "bg-gray-300" : ""}
                >
                  {category}
                </Button>
              ))}
          </div>

          {subcategories.length > 0 && (
            <div className="my-4">
              <Select
                variant="outlined"
                label="Select Subcategory"
                value={selectedSubcategory}
                onChange={(value) => setSelectedSubcategory(value)}
              >
                <Option value="">All Subcategories</Option>
                {subcategories.map((subcategory) => (
                  <Option key={subcategory} value={subcategory}>
                    {subcategory}
                  </Option>
                ))}
              </Select>
            </div>
          )}
        </>
      )}

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
                onGetProductId={handleDetailedProduct}
              />
            ))
          ) : (
            <p className="text-gray-700 text-base">No products available</p>
          )}
        </div>
      )}

      <div className="flex justify-center items-center mt-8">
        <Button
          onClick={handlePreviousPage}
          className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <p className="mx-4 text-sm">
          Page {currentPage} of {totalPages}
        </p>
        <Button
          onClick={handleNextPage}
          className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ManageProducts;
