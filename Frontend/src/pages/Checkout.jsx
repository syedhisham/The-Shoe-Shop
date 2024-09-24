import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ErrorToast from "../components/ErrorToast";
import SuccessToast from "../components/SuccessToast";
import axios from "axios";
import { Button, Select, Option, Textarea } from "@material-tailwind/react";

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get(`/api/cart/get-cart/user/${userId}`);
        const items = response.data.data.items || [];
        setCartItems(items);

        const total = items.reduce(
          (sum, item) => sum + item.productDetails.price * item.quantity,
          0
        );
        setTotalAmount(total);
      } catch (err) {
        setError("Failed to fetch cart items");
      }
    };

    fetchCartItems();
  }, [userId]);

  const handleCheckout = async () => {
    if (!shippingAddress || !paymentMethod) {
      setError("Please fill out shipping address and select a payment method.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const orderData = {
        user: userId,
        products: cartItems.map((item) => ({
          product: item.productDetails._id,
          quantity: item.quantity,
        })),
        totalAmount,
        paymentMethod,
        shippingAddress,
      };

      const response = await axios.post("/api/orders/create", orderData);
      if (response.status === 201) {
        const orderId = response.data.data._id;
        navigate(`/orderConfirmation/${orderId}`, {
          state: {
            totalAmount,
            paymentMethod,
            shippingAddress,
            cartItems,
          },
        });
      }
    } catch (error) {
      setError("Failed to place the order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container max-w-screen-sm mx-auto p-5 mb-10">
      <h1 className="text-3xl font-semibold mb-8 text-center">Checkout</h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4 ">Shipping Address</h2>
        <Textarea
          variant="outlined"
          label="Shipping Address"
          type="text"
          value={shippingAddress}
          onChange={(e) => setShippingAddress(e.target.value)}
          className="w-full mb-3"
        />
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
        <Select
          label="Payment Method"
          value={paymentMethod}
          onChange={(value) => setPaymentMethod(value)}
          className="w-full mb-3"
        >
          <Option value="Credit Card">Credit Card</Option>
          <Option value="JazzCash">JazzCash</Option>
          <Option value="EasyPaisa">EasyPaisa</Option>
          <Option value="Cash on Delivery">Cash on Delivery</Option>
        </Select>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        {cartItems.map((item, index) => (
          <div
            key={`${item.productDetails._id}-${index}`}
            className="flex justify-between mb-2"
          >
            <span>{item.productDetails.name}</span>
            <span>Rs {item.productDetails.price * item.quantity}</span>
          </div>
        ))}
        <div className="flex justify-between font-semibold text-lg mt-4">
          <span>Total:</span>
          <span>Rs {totalAmount}</span>
        </div>
      </div>

      <Button
        onClick={handleCheckout}
        disabled={loading}
        className={`w-full bg-gray-800 text-white py-3 rounded hover:bg-gray-900 transition-all duration-300 ${
          loading && "opacity-50 cursor-not-allowed"
        }`}
      >
        {loading ? "Processing..." : "Place Order"}
      </Button>
    </div>
  );
};

export default Checkout;
