import React from "react";
import ReactDOM from "react-dom";
import { FaExclamationCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SignInPopup = ({ onClose }) => {
  const navigate = useNavigate();
  const onNavigate = () => navigate("/login");
  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50 transition-opacity duration-300 animate-fadeIn">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full transform transition-transform duration-300 animate-popup">
        <div className="flex items-center mb-4">
          <FaExclamationCircle className="text-red-500 text-2xl mr-2" />
          <h2 className="text-xl font-semibold">Sign In Required</h2>
        </div>
        <p className="mb-4">
          You need to sign in to submit a comment. Please log in to continue.
        </p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onNavigate}
            className="bg-gray-800 hover:bg-black text-white py-2 px-4 rounded-lg transition duration-300 transform hover:scale-105"
          >
            Sign In
          </button>
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition duration-300 transform hover:scale-105"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.getElementById("portal-root")
  );
};

export default SignInPopup;
