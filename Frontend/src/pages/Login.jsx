import React, { useState } from "react";
import { Button, Input, Typography } from "@material-tailwind/react";
import { useNavigate, useLocation } from "react-router-dom";
import { useNavigation } from "../context/NavigationContext";
import axios from "axios";
import SuccessToast from "../components/SuccessToast";
import ErrorToast from "../components/ErrorToast";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { lastPath } = useNavigation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("/api/users/login", formData);
      console.log("Response data is", response.data);

      const { token } = response.data;
      localStorage.setItem("token", token);
      SuccessToast("Login successful!");
      setFormData({ email: "", password: "" });
      navigate(lastPath || "/");
    } catch (error) {
      console.error(error);
      ErrorToast("Error logging in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <ToastContainer />
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
        <Typography variant="h4" className="text-center mb-6">
          Log In
        </Typography>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            label="Email"
            variant="outlined"
            size="lg"
            color="blue"
            placeholder="Enter your email"
            required
          />
          <Input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            label="Password"
            variant="outlined"
            size="lg"
            color="blue"
            placeholder="Enter your password"
            required
          />
          <Button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent border-solid rounded-full animate-spin"></div>
              </div>
            ) : (
              "Log In"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
