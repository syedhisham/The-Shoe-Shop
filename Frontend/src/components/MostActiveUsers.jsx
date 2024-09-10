import React from "react";
import UserList from "./UserList";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MostActiveUsers = () => {
  return (
    <div className="p-4">
      <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-4 text-center">
        Most Active Users
      </h1>
      <UserList showFullDetails={false} showActivityScore={false} />
      <ToastContainer />
    </div>
  );
};

export default MostActiveUsers;
