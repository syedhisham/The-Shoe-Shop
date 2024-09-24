import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingOverlay from "../components/LoadingOverlay";
import ErrorToast from "../components/ErrorToast";
import SuccessToast from "../components/SuccessToast";
import { Button } from "@material-tailwind/react";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [inventoryStatus, setInventoryStatus] = useState({
    textColor: "",
    circleColor: "",
    text: "",
  });

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!userId) {
        setError("User ID not found");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`/api/cart/get-cart/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data && response.data.data) {
          const items = response.data.data.items || [];
          setCartItems(items);
          setError(null);
        } else {
          setCartItems([]);
          setError("Unexpected response structure");
        }
      } catch (error) {
        setError("Failed to fetch cart items");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [userId]);

  useEffect(() => {
    if (cartItems) {
      const product = cartItems.map((item) => item.productDetails);
      console.log("This is product logged", product.stock);

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
  }, [cartItems]);

  const handleDeleteItem = async (productId) => {
    try {
      await axios.delete(
        `/api/cart/delete-item/user/${userId}/product/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      SuccessToast("Item removed");

      setCartItems((prevItems) => {
        const updatedItems = prevItems.filter(
          (item) => item.product !== productId
        );
        if (updatedItems.length === 0) {
          setError(null);
        }
        return updatedItems;
      });
    } catch (error) {
      setError("Failed to delete item from cart");
      ErrorToast("Failed to delete item from cart");
      console.error(error);
    }
  };

  const handleUpdateItem = (item, size, color) => {
    navigate(`/detailedProduct/${item}`, {
      state: {
        selectedSize: size,
        selectedColor: color,
      },
    });
  };

  const handleCheckout = () => {
    navigate(`/checkout`);
  };

  if (loading) {
    return <LoadingOverlay />;
  }

  return (
    <div className="max-w-screen-2xl mx-auto p-5">
      {error && <div className="text-center p-5 text-red-500">{error}</div>}
      <h1 className="text-3xl font-semibold mb-5 text-center">Your Cart</h1>

      {cartItems.length > 0 ? (
        <div className="flex flex-col space-y-4">
          {cartItems.map((item, index) => (
            <div
              key={`${item.productDetails._id}-${index}`}
              className="flex flex-col sm:flex-row justify-center items-start border border-gray-300 p-4 rounded-lg shadow-md bg-white"
            >
              {item.productImages.length > 0 && (
                <img
                  src={item.productImages[0].imageUrl}
                  alt={item.productDetails.name}
                  className="w-36 h-36 object-cover rounded mr-4 mb-4 sm:mb-0"
                />
              )}
              <div className="flex flex-col flex-grow justify-center mt-2">
                <div className="flex gap-5 items-center">
                  <h2 className="text-xl font-semibold mb-1">
                    {item.productDetails.name.toUpperCase()}
                  </h2>

                  <div className="flex items-center -mt-1">
                    <div
                      className={`w-2 h-2 rounded-full ${inventoryStatus.circleColor}`}
                    ></div>
                    <p className={`ml-2 ${inventoryStatus.textColor}`}>
                      {inventoryStatus.text}
                    </p>
                  </div>
                </div>

                <p className="font-semibold text-gray-700 text-sm">
                  Color:
                  <span className="font-normal"> {item.color}</span>
                </p>
                <p className="font-semibold text-gray-700 text-sm">
                  Size:
                  <span className="font-normal"> {item.size}</span>
                </p>
                <p className="font-semibold text-gray-700 text-sm">
                  Quantity:
                  <span className="font-normal"> {item.quantity}</span>
                </p>
                <p className="text-gray-700 font-bold mt-2">
                  Price: Rs {item.productDetails.price * item.quantity}
                </p>
              </div>

              <div className="flex flex-col my-auto space-y-2 sm:ml-4">
                <Button
                  variant="text"
                  onClick={() =>
                    handleUpdateItem(item.product, item.size, item.color)
                  }
                  className="border"
                >
                  Update
                </Button>
                <Button
                  variant="text"
                  onClick={() => handleDeleteItem(item.product)}
                  className="border"
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">Your cart is empty.</div>
      )}

      {cartItems.length > 0 && (
        <div className="text-right mt-6">
          <Button
            onClick={handleCheckout}
            className="bg-gray-800 text-white px-6 py-3 rounded hover:bg-gray-900 transition-all duration-300 ease-in-out"
          >
            Checkout
          </Button>
        </div>
      )}
    </div>
  );
};

export default Cart;
