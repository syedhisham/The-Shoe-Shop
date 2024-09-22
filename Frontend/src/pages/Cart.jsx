import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingOverlay from "../components/LoadingOverlay";
import ErrorToast from "../components/ErrorToast";
import SuccessToast from "../components/SuccessToast";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) {
    return <LoadingOverlay />;
  }

  return (
    <div className="max-w-screen-2xl mx-auto p-5">
      {error && <div className="text-center p-5 text-red-500">{error}</div>}
      <h1 className="text-3xl font-semibold mb-5 text-center">Your Cart</h1>

      {cartItems.length > 0 ? (
        <div className="flex flex-col space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.productDetails._id}
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
              <button
                onClick={() => handleDeleteItem(item.product)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mt-4 sm:mt-0 sm:ml-4"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">Your cart is empty.</div>
      )}
    </div>
  );
};

export default Cart;
