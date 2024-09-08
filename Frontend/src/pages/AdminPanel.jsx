import React, { useState } from "react";
import {
  HomeIcon,
  UsersIcon,
  ArchiveBoxIcon,
  ShoppingBagIcon,
  CogIcon,
} from "@heroicons/react/24/outline";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import AddProductForm from "../components/AddProductForm";
// import UserManagement from './UserManagement';
// import OrderManagement from './OrderManagement';
// import Settings from './Settings';

const sidebarItems = [
  { label: "Dashboard", icon: HomeIcon, component: <div>Dashboard</div> },
  // { label: 'User Management', icon: UsersIcon, component: <UserManagement /> },
  {
    label: "Product Management",
    icon: ArchiveBoxIcon,
    component: <AddProductForm />,
  },
  // { label: 'Order Management', icon: ShoppingBagIcon, component: <OrderManagement /> },
  // { label: 'Settings', icon: CogIcon, component: <Settings /> },
];

export default function AdminPanel() {
  const [activeComponent, setActiveComponent] = useState(
    sidebarItems[0].component
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-md z-40 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          <div className="flex-shrink-0 px-6 py-4 bg-gray-800 text-white relative">
            <h1 className="text-xl font-bold">Admin Panel</h1>
            <button
              className="md:hidden absolute top-4 right-4 p-2 text-white"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
          <nav className="flex-1 px-2 py-4">
            <ul>
              {sidebarItems.map(({ label, icon: Icon, component }, index) => (
                <li key={index} className="mb-2">
                  <button
                    className={`flex items-center w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-200 rounded-md ${activeComponent === component ? "bg-gray-300" : ""}`}
                    onClick={() => setActiveComponent(component)}
                  >
                    <Icon className="h-6 w-6 mr-3" />
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>

      <main
        className={`flex-1 p-6 overflow-y-auto transition-transform duration-300 ease-in-out ${sidebarOpen ? "ml-64" : ""}`}
      >
        <button
          className="md:hidden fixed top-4 left-4 p-2 text-gray-800 bg-white rounded-md shadow-md"
          onClick={() => setSidebarOpen(true)}
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
        {activeComponent}
      </main>
    </div>
  );
}
