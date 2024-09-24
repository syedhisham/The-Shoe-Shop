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
import ContactUs from "./components/ContactUs";
import AboutUs from "./pages/AboutUs";
import Cart from "./pages/Cart";
import GentsShoes from "./pages/GentsShoes";
import GentsSandals from "./pages/GentsSandals";
import GentsSlippers from "./pages/GentsSlippers";
import GentsSneakers from "./pages/GentsSneakers";
import LadiesSandals from "./pages/LadiesSandals";
import LadiesPumps from "./pages/LadiesPumps";
import LadiesSneakers from "./pages/LadiesSneakers";
import LadiesShoes from "./pages/LadiesShoes";
import LadiesSlippers from "./pages/LadiesSlippers";
import GentsNewArrivals from "./pages/GentsNewArrivals";
import LadiesNewArrival from "./pages/LadiesNewArrival";
import GentsFootwear from "./pages/GentsFootwear";
import LadiesFootwear from "./pages/LadiesFootwear";
import FindUs from "./components/FindUs";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />} >
        <Route path="/allProducts" element={<AllProducts />} />
        <Route path="/detailedProduct/:productId" element={<DetailedProduct />} />
        <Route path="/contactUs" element={<ContactUs />} />
        <Route path="/aboutUs" element={<AboutUs />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/gentsShoes" element={<GentsShoes />} />
        <Route path="/gentsSandals" element={<GentsSandals />} />
        <Route path="/gentsSlippers" element={<GentsSlippers />} />
        <Route path="/gentsSneakers" element={<GentsSneakers />} />
        <Route path="/ladiesSandals" element={<LadiesSandals />} />
        <Route path="/ladiesPumps" element={<LadiesPumps />} />
        <Route path="/ladiesSneakers" element={<LadiesSneakers />} />
        <Route path="/ladiesShoes" element={<LadiesShoes />} />
        <Route path="/ladiesSlippers" element={<LadiesSlippers />} />
        <Route path="/gentsNewArrivals" element={<GentsNewArrivals />} />
        <Route path="/ladiesNewArrivals" element={<LadiesNewArrival />} />
        <Route path="/gentsFootwear" element={<GentsFootwear />} />
        <Route path="/ladiesFootwear" element={<LadiesFootwear />} />
        <Route path="/findUs" element={<FindUs />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orderConfirmation/:orderId" element={<OrderConfirmation />} />
        
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
