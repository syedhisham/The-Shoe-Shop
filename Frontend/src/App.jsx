import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AddProductForm from "./components/AddProductForm";
import AdminPanel from "./pages/AdminPanel";
import ProductList from "./components/ProductCards";
import UserList from "./components/UserList";
import UserDeleteList from "./components/UserDeleteList";
import MostActiveUsers from "./components/MostActiveUsers";
import ManageProducts from "./pages/ManageProducts";
import ProductUpdateForm from "./pages/ProductUpdateForm";
import ProductUpdateImage from "./pages/ProductUpdateImage";
import AllProducts from "./components/AllProducts";
import DetailedProduct from "./components/DetailedProduct";
import MostRatedProducts from "./components/MostRatedProducts";
import CustomerTestimonials from "./components/Testimonials";
import Layout from "./components/Layout";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />} >
        <Route path="/allProducts" element={<AllProducts />} />
        <Route path="/detailedProduct/:productId" element={<DetailedProduct />} />
        
        </Route>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/addProduct" element={<AddProductForm />} />
        <Route path="/adminPanel" element={<AdminPanel />} />
        <Route path="/productCards" element={<ProductList />} />
        <Route path="/manageProducts" element={<ManageProducts />} />
        <Route path="/updateProductDetails" element={<ProductUpdateForm />} />
        <Route path="/updateProductImages" element={<ProductUpdateImage />} />
        <Route path="/allProducts" element={<AllProducts />} />
        <Route path="/mostRatedProducts" element={<MostRatedProducts />} />
        <Route path="/allUsers" element={<UserList />} />
        <Route path="/removeUser" element={<UserDeleteList />} />
        <Route path="/mostActiveUsers" element={<MostActiveUsers />} />
        <Route path="/testimonials" element={<CustomerTestimonials/>} />
      </Routes>
    </Router>
  );
}

export default App;
