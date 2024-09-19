import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
  IconButton,
} from "@material-tailwind/react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { TiArrowLeftThick, TiArrowRightThick } from "react-icons/ti";

const MostRatedProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMostRatedProducts = async () => {
      try {
        const response = await axios.get("/api/products/most-rated-products");
        const productData = response.data.data;

        const uniqueCategories = [
          ...new Set(productData.map((p) => p.product.category)),
        ];
        setCategories(uniqueCategories);

        if (uniqueCategories.length > 0) {
          const defaultCategory = uniqueCategories[0];
          setSelectedCategory(defaultCategory);

          const initialFilteredProducts = productData
            .filter((p) => p.product.category === defaultCategory)
            .sort((a, b) => b.averageRating - a.averageRating);

          setProducts(productData);
          setFilteredProducts(initialFilteredProducts);
        }
      } catch (error) {
        console.error("Error fetching most rated products:", error);
      }
    };

    fetchMostRatedProducts();
  }, []);

  const scrollLeft = () => {
    scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const totalStars = 5;

    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <AiFillStar key={i} className="text-yellow-500" />
        ))}
        {hasHalfStar && (
          <AiFillStar
            className="text-yellow-500"
            style={{ clipPath: "inset(0 50% 0 0)" }}
          />
        )}
        {[...Array(totalStars - fullStars - (hasHalfStar ? 1 : 0))].map(
          (_, i) => (
            <AiOutlineStar key={i} className="text-yellow-500" />
          )
        )}
      </div>
    );
  };

  const formatRating = (rating) => rating.toFixed(1);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);

    const updatedFilteredProducts = products
      .filter((p) => p.product.category === category)
      .sort((a, b) => b.averageRating - a.averageRating);

    setFilteredProducts(updatedFilteredProducts);
  };
  const handleViewProduct = (productId) => {
    navigate(`/detailedProduct/${productId}`);
  };
  return (
    <div className=" mx-auto p-4">
      <div className="mb-4 ">
        <div className="flex justify-center items-center gap-5 mb-4 ">
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`text-gray-800 ${selectedCategory === category ? "bg-gray-300" : "bg-gray-600 text-white"}`}
            >
              {category}
            </Button>
          ))}
        </div>
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto space-x-6 pb-4 scroll-smooth hide-scroll-bar"
          >
            {filteredProducts.map((product) => (
              <Card
                key={product.product._id}
                className="h-[25rem] w-[17rem] sm:h-[30rem] sm:w-[22rem] md:h-[35rem] md:w-[24rem] flex-shrink-0 "
              >
                <CardHeader
                  shadow={false}
                  floated={false}
                  className="h-1/2 sm:h-1/2 md:h-full lg:h-full xl:h-full "
                >
                  <img
                    src={product.images[0]}
                    alt={product.product.name}
                    className="h-full w-full object-cover "
                  />
                </CardHeader>

                <CardBody>
                  <div className="mb-2 flex items-center justify-between">
                    <Typography
                      color="blue-gray"
                      className="font-medium text-sm sm:text-base md:text-lg lg:text-xl"
                    >
                      {product.product.name}
                    </Typography>
                    <Typography
                      color="blue-gray"
                      className=" text-sm sm:text-base md:text-sm lg:text-lg"
                    >
                      Rs{product.product.price}
                    </Typography>
                  </div>
                  <div className="mb-2 flex gap-2">
                    {renderStars(product.averageRating)}
                    <Typography
                      variant="small"
                      color="gray"
                      className="font-normal opacity-75 text-xs sm:text-sm md:text-base"
                    >
                      Rating: {formatRating(product.averageRating)}
                    </Typography>
                  </div>
                </CardBody>

                <CardFooter className="pt-0">
                  <Button
                    onClick={() => handleViewProduct(product.product._id)}
                    ripple={false}
                    fullWidth={true}
                    className="bg-blue-gray-900/10 text-blue-gray-900 shadow-none hover:scale-105 hover:shadow-none focus:scale-105 focus:shadow-none active:scale-100"
                  >
                    View Product
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          <IconButton
            onClick={scrollLeft}
            className="absolute bottom-80 left-2 transform  bg-white/60 text-black z-10 text-lg"
          >
            <TiArrowLeftThick />
          </IconButton>
          <IconButton
            onClick={scrollRight}
            className="absolute bottom-[23rem] left-[93%] transform  bg-white/60 text-black z-10 text-lg"
          >
            <TiArrowRightThick />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default MostRatedProducts;
