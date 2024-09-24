import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingOverlay from "../components/LoadingOverlay";
import ErrorToast from "../components/ErrorToast";
import SuccessToast from "../components/SuccessToast";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

  const handleUpdateItem = (item) => {
    navigate(`/detailedProduct/${item}`);
  };

  const handleCheckout = () => {
    navigate(`/checkout`); 
  };

  if (loading) {
    return <LoadingOverlay />;
  }

const itemsArray = cartItems.map((item) =>   console.log("This is cart items",item.product))
  

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
                  className="w-24 h-24 object-cover rounded mr-4 mb-4 sm:mb-0"
                />
              )}
              <div className="flex flex-col flex-grow justify-center">
                <h2 className="text-xl font-semibold mb-1">
                  {item.productDetails.name}
                </h2>
                <p className="text-gray-700">Color: {item.color}</p>
                <p className="text-gray-700">Size: {item.size}</p>
                <p className="text-gray-700">Quantity: {item.quantity}</p>
                <p className="text-gray-700 font-bold mt-2">
                  Price: Rs {item.productDetails.price * item.quantity}
                </p>
              </div>

              <div className="flex flex-col space-y-2 sm:ml-4">
                <button
                  onClick={() => handleUpdateItem(item.product)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDeleteItem(item.product)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">Your cart is empty.</div>
      )}

      {/* Checkout Button */}
      {cartItems.length > 0 && (
        <div className="text-right mt-6">
          <button
            onClick={handleCheckout}
            className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600 transition"
          >
            Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
