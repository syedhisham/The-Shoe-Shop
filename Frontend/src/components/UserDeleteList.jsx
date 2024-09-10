import React from "react";
import axios from "axios";
import UserList from "./UserList";
import SuccessToast from "./SuccessToast";
import ErrorToast from "./ErrorToast";

const UserDeleteList = () => {
  const handleDelete = async (userId) => {
    try {
      await axios.delete(`/api/users/remove-user/${userId}`);
      SuccessToast("User deleted successfully.");
    } catch (error) {
      ErrorToast("Failed to delete user. Please try again later.");
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="p-4">
      <UserList onDelete={handleDelete} />
    </div>
  );
};

export default UserDeleteList;
