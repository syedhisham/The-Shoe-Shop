import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Logout = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("/api/users/logout");
      toast.success("Logged out successfully!");
      localStorage.removeItem("token");
      onLogout();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Error logging out. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center">
      <ToastContainer />
      <button
        onClick={handleLogout}
        className="py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300"
      >
        Log Out
      </button>
    </div>
  );
};

export default Logout;
