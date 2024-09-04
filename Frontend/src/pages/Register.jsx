import React, { useState } from "react";
import axios from "axios";
import {
  Input,
  Select,
  Option,
  Textarea,
  Spinner,
} from "@material-tailwind/react";
import SuccessToast from "../components/SuccessToast";
import ErrorToast from "../components/ErrorToast";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gender: "Male",
    phone: "",
    password: "",
    address: [{ addressLine1: "", city: "", province: "", postalCode: "" }],
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddressChange = (index, e) => {
    const newAddresses = [...formData.address];
    newAddresses[index][e.target.name] = e.target.value;
    setFormData({ ...formData, address: newAddresses });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/api/users/register", formData);
      SuccessToast("Registration Successful");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        gender: "Male",
        phone: "",
        password: "",
        address: [{ addressLine1: "", city: "", province: "", postalCode: "" }],
      });
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error(error);
      ErrorToast("Error registering user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative max-w-4xl mx-auto my-10 p-8 bg-white shadow-xl rounded-lg transform transition duration-500 hover:shadow-2xl">
      <ToastContainer />
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-blue-500 bg-opacity-30 z-50 backdrop-blur-sm">
          <Spinner className="h-16 w-16 text-blue-600" />
        </div>
      )}
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Register
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <fieldset className="p-4 border rounded-md shadow-sm">
            <legend className="text-lg font-semibold text-gray-700 px-2">
              Personal Information
            </legend>
            <div className="mt-4">
              <Input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                variant="outlined"
                label="First Name"
                size="lg"
                color="blue"
                placeholder="Enter your first name"
                required
              />
            </div>
            <div className="mt-4">
              <Input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                variant="outlined"
                label="Last Name"
                size="lg"
                color="blue"
                placeholder="Enter your last name"
                required
              />
            </div>
            <div className="mt-4">
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                variant="outlined"
                label="Email"
                size="lg"
                color="blue"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="mt-4">
              <Select
                label="Select Gender"
                id="gender"
                name="gender"
                size="lg"
                color="blue"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e })}
                required
              >
                <Option value="Male">Male</Option>
                <Option value="Female">Female</Option>
                <Option value="Other">Other</Option>
              </Select>
            </div>
            <div className="mt-4">
              <Input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                variant="outlined"
                label="Phone"
                size="lg"
                color="blue"
                placeholder="Enter your phone number"
                required
              />
            </div>
            <div className="mt-4">
              <Input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                variant="outlined"
                label="Password"
                size="lg"
                color="blue"
                placeholder="Enter your password"
                required
              />
            </div>
          </fieldset>
          <fieldset className="p-4 border rounded-md shadow-sm">
            <legend className="text-lg font-semibold text-gray-700 px-2">
              Address Information
            </legend>
            <div className="mt-4">
              <Textarea
                name="addressLine1"
                rows="4"
                value={formData.address[0].addressLine1}
                label="Address Line"
                color="blue"
                onChange={(e) => handleAddressChange(0, e)}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="mt-4">
              <Input
                type="text"
                name="city"
                value={formData.address[0].city}
                onChange={(e) => handleAddressChange(0, e)}
                variant="outlined"
                label="City"
                size="lg"
                color="blue"
                placeholder="Enter your city"
              />
            </div>
            <div className="mt-4">
              <Input
                type="text"
                name="province"
                value={formData.address[0].province}
                onChange={(e) => handleAddressChange(0, e)}
                variant="outlined"
                label="Province"
                size="lg"
                color="blue"
                placeholder="Enter your state or province"
              />
            </div>
            <div className="mt-4">
              <Input
                type="text"
                name="postalCode"
                value={formData.address[0].postalCode}
                onChange={(e) => handleAddressChange(0, e)}
                variant="outlined"
                label="Postal Code"
                size="lg"
                color="blue"
                placeholder="Enter your postal code"
              />
            </div>
          </fieldset>
        </div>
        <button
          type="submit"
          className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-transform transform hover:scale-105"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
