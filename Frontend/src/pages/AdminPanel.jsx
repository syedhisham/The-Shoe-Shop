import React, { useState } from "react";
import { FaHome, FaUsers, FaShoppingBag, FaCog } from "react-icons/fa";
import { MdArchive } from "react-icons/md";
import { FaBars, FaTimes } from "react-icons/fa";
import AddProductForm from "../components/AddProductForm";
import UserList from "../components/UserList";
import UserDeleteList from "../components/UserDeleteList";
import MostActiveUsers from "../components/MostActiveUsers";
import ManageProducts from "./ManageProducts";
import AllProducts from "../components/AllProducts";

const sidebarItems = [
  { label: "Dashboard", icon: FaHome, component: <div>Dashboard</div> },
  { label: "User Management", icon: FaUsers, component: null },
  { label: "Product Management", icon: MdArchive, component: null },
  { label: "Order Management", icon: FaShoppingBag, component: null },
  { label: "Settings", icon: FaCog, component: null },
];

const productManagementItems = [
  { label: "Add Product", component: <AddProductForm /> },
  { label: "Manage Products", component: <ManageProducts /> },
  { label: "All Products", component: <AllProducts /> },
];

const userManagementItems = [
  {
    label: "All Users",
    component: (
      <div>
        <UserList />
      </div>
    ),
  },
  {
    label: "Most Active Users",
    component: (
      <div>
        <MostActiveUsers />
      </div>
    ),
  },
  {
    label: "Delete Users",
    component: (
      <div>
        <UserDeleteList />
      </div>
    ),
  },
];

const orderManagementItems = [
  { label: "View Orders", component: <div>View Orders Component</div> },
  {
    label: "Update Order Status",
    component: <div>Update Order Status Component</div>,
  },
  { label: "Cancel Orders", component: <div>Cancel Orders Component</div> },
  { label: "All Orders", component: <div>All Orders Component</div> },
];

const settingsItems = [
  {
    label: "Profile Settings",
    component: <div>Profile Settings Component</div>,
  },
  { label: "System Settings", component: <div>System Settings Component</div> },
  {
    label: "Security Settings",
    component: <div>Security Settings Component</div>,
  },
];

const AdminPanel = () => {
  const [activeComponent, setActiveComponent] = useState(
    sidebarItems[0].component
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isOrderDropdownOpen, setIsOrderDropdownOpen] = useState(false);
  const [isSettingsDropdownOpen, setIsSettingsDropdownOpen] = useState(false);

  const handleDropdownItemClick = (component) => {
    setActiveComponent(component);
    setIsProductDropdownOpen(false);
    setIsUserDropdownOpen(false);
    setIsOrderDropdownOpen(false);
    setIsSettingsDropdownOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-2xl z-40 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:relative md:w-64 md:translate-x-0 lg:w-72 xl:w-80`}
      >
        <div className="flex flex-col h-full">
          <div className="flex-shrink-0 px-6 py-4 bg-black text-white relative">
            <h1 className="text-xl font-bold">Admin Panel</h1>
            <button
              className="md:hidden absolute top-4 right-4 p-2 text-white"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
          <nav className="flex-1 px-2 py-4 overflow-y-auto scrollbar-hidden scroll-smooth bg-gray-800 ">
            <ul className="space-y-2">
              {sidebarItems.map(({ label, icon: Icon, component }, index) => (
                <li key={index} className="relative group">
                  {label === "Product Management" ? (
                    <>
                      <button
                        className={`flex items-center w-full px-4 py-2 text-left text-white hover:bg-gray-600 rounded-md transition duration-300 ease-in-out transform hover:scale-105 text-sm md:text-base lg:text-lg ${
                          isProductDropdownOpen ? "bg-gray-700" : ""
                        }`}
                        onClick={() =>
                          setIsProductDropdownOpen(!isProductDropdownOpen)
                        }
                      >
                        <Icon className="h-6 w-6 mr-3" />
                        {label}
                      </button>
                      <ul
                        className={`ml-8 mt-2 space-y-2 transition-all duration-300 ease-in-out ${
                          isProductDropdownOpen
                            ? "max-h-40 opacity-100 mb-3"
                            : "max-h-0 opacity-0 overflow-hidden"
                        }`}
                      >
                        {productManagementItems.map((item, subIndex) => (
                          <li key={subIndex}>
                            <button
                              className="flex items-center w-full px-4 py-2 text-left text-white hover:bg-gray-600 rounded-md transition duration-300 ease-in-out transform hover:scale-105 bg-gray-900"
                              onClick={() =>
                                handleDropdownItemClick(item.component)
                              }
                            >
                              {item.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : label === "Dashboard" ? (
                    <button
                      className={`flex items-center w-full px-4 py-2 text-left text-white rounded-md transition duration-300 ease-in-out transform hover:scale-105 text-sm md:text-base lg:text-lg `}
                      onClick={() => setActiveComponent(component)}
                    >
                      <Icon className="h-6 w-6 mr-3" />
                      {label}
                    </button>
                  ) : label === "User Management" ? (
                    <>
                      <button
                        className={`flex items-center w-full px-4 py-2 text-left text-white rounded-md transition duration-300 ease-in-out transform hover:scale-105 text-sm md:text-base lg:text-lg   ${
                          isUserDropdownOpen ? "bg-gray-700" : ""
                        }`}
                        onClick={() =>
                          setIsUserDropdownOpen(!isUserDropdownOpen)
                        }
                      >
                        <Icon className="h-6 w-6 mr-3" />
                        {label}
                      </button>
                      <ul
                        className={`ml-8 mt-2 space-y-2 transition-all duration-300 ease-in-out ${
                          isUserDropdownOpen
                            ? "max-h-40 opacity-100 mb-3"
                            : "max-h-0 opacity-0 overflow-hidden"
                        }`}
                      >
                        {userManagementItems.map((item, subIndex) => (
                          <li key={subIndex}>
                            <button
                              className="flex items-center w-full px-4 py-2 text-left text-white hover:bg-gray-600 rounded-md transition duration-300 ease-in-out transform hover:scale-105 bg-gray-900"
                              onClick={() =>
                                handleDropdownItemClick(item.component)
                              }
                            >
                              {item.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : label === "Order Management" ? (
                    <>
                      <button
                        className={`flex items-center w-full px-4 py-2 text-left text-white rounded-md transition duration-300 ease-in-out transform hover:scale-105 text-sm md:text-base lg:text-lg   ${
                          isOrderDropdownOpen ? "bg-gray-700" : ""
                        }`}
                        onClick={() =>
                          setIsOrderDropdownOpen(!isOrderDropdownOpen)
                        }
                      >
                        <Icon className="h-6 w-6 mr-3" />
                        {label}
                      </button>
                      <ul
                        className={`ml-8 mt-2 space-y-2 transition-all duration-300 ease-in-out ${
                          isOrderDropdownOpen
                            ? "max-h-40 opacity-100 mb-8"
                            : "max-h-0 opacity-0 overflow-hidden"
                        }`}
                      >
                        {orderManagementItems.map((item, subIndex) => (
                          <li key={subIndex}>
                            <button
                              className="flex items-center w-full px-4 py-2 text-left text-white hover:bg-gray-600 rounded-md transition duration-300 ease-in-out transform hover:scale-105 bg-gray-900"
                              onClick={() =>
                                handleDropdownItemClick(item.component)
                              }
                            >
                              {item.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : label === "Settings" ? (
                    <>
                      <button
                        className={`flex items-center w-full px-4 py-2 text-left text-white rounded-md transition duration-300 ease-in-out transform hover:scale-105 text-sm md:text-base lg:text-lg   ${
                          isSettingsDropdownOpen ? "bg-gray-700" : ""
                        }`}
                        onClick={() =>
                          setIsSettingsDropdownOpen(!isSettingsDropdownOpen)
                        }
                      >
                        <Icon className="h-6 w-6 mr-3" />
                        {label}
                      </button>
                      <ul
                        className={`ml-8 mt-2 space-y-2 transition-all duration-300 ease-in-out ${
                          isSettingsDropdownOpen
                            ? "max-h-40 opacity-100 mb-5"
                            : "max-h-0 opacity-0 overflow-hidden"
                        }`}
                      >
                        {settingsItems.map((item, subIndex) => (
                          <li key={subIndex}>
                            <button
                              className="flex items-center w-full px-4 py-2 text-left text-white hover:bg-gray-600 rounded-md transition duration-300 ease-in-out transform hover:scale-105 bg-gray-900"
                              onClick={() =>
                                handleDropdownItemClick(item.component)
                              }
                            >
                              {item.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <button
                      className={`flex items-center w-full px-4 py-2 text-left text-white hover:bg-gray-800 rounded-md transition duration-300 ease-in-out transform hover:scale-105 ${
                        activeComponent === component ? "bg-gray-900" : ""
                      }`}
                      onClick={() => setActiveComponent(component)}
                    >
                      <Icon className="h-6 w-6 mr-3" />
                      {label}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>

      <main
        className={`flex-1 p-6 overflow-y-auto transition-transform duration-300 ease-in-out ${sidebarOpen ? "ml-64" : "ml-10"}`}
      >
        <button
          className="md:hidden fixed top-4 left-4 p-2 text-gray-800 bg-white rounded-md shadow-md"
          onClick={() => setSidebarOpen(true)}
        >
          <FaBars className="h-6 w-6" />
        </button>
        {activeComponent}
      </main>
    </div>
  );
};
export default AdminPanel;
