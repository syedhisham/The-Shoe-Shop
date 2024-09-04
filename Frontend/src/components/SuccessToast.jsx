import React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SuccessToast = (message, options = {}) => {
  toast.success(<div className="flex items-center">{message}</div>, {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    theme: "light",
    style: {
      color: "#44B851",
      fontWeight: "500",
      padding: "10px 15px",
      borderRadius: "8px",
      boxShadow: "0 3px 6px rgba(0, 0, 0, 0.1)",
    },
    ...options,
  });
};

export default SuccessToast;
