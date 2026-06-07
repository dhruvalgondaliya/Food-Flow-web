import { useEffect, useState } from "react";
import "./App.css";
import BackToTopButton from "./Component/BackToTopButton";
import { Routes, Route, useLocation } from "react-router-dom";
import axios from "axios";
import Footer from "./Component/Footer/Footer";
import Header from "./Component/Header/Header";
import Registration from "./Page/Registration";
import FullCategoryItems from "./Component/FamilyDeals/FullCategoryItems";
import ScrollToTop from "./Component/CommanComponent/ScrollToTop";
import ProtectedRoute from "./Component/Utiles/ProtectedRoute";
import { API_URL } from "./Component/Server/Server";
import Login from "./Page/Login";
import Home from "./Page/Home";
import CartPage from "./Page/CartPage";
import OrderSuccess from "./Page/OrderSuccess";
import UserReview from "./Page/UserReview";
import ForgotPasswordPage from "./Page/ForgotPasswordPage";
import UserProfiles from "./Component/UserProfile/UserProfiles";
import About from "./Page/About";
import Faq from "./Page/Faq";
import MobileBottomNav from "./Component/CommanComponent/MobileBottomNav";

function App() {
  const [cartCount, setCartCount] = useState(0);
  const location = useLocation();

  const hideChrome =
    location.pathname === "/login" ||
    location.pathname === "/registration" ||
    location.pathname === "/forgot-password";

  useEffect(() => {
    const fetchCartCount = async () => {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      if (!userId || !token) {
        setCartCount(0);
        return;
      }

      try {
        const res = await axios.get(`${API_URL}cart/fetch/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const cart = res.data?.data;
        setCartCount(cart?.cartLength ?? cart?.items?.length ?? 0);
      } catch (_error) {
        setCartCount(0);
      }
    };

    fetchCartCount();
  }, [location.pathname]);

  return (
    <>
      <ScrollToTop />
      <BackToTopButton />
      {!hideChrome && (
        <Header cartCount={cartCount} setCartCount={setCartCount} />
      )}
      <div
        className={
          hideChrome
            ? ""
            : "pb-[calc(4.5rem+env(safe-area-inset-bottom))] xl:pb-0"
        }
      >
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<Faq />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route index element={<Home setCartCount={setCartCount} />} />
            <Route path="/detail-Items" element={<FullCategoryItems />} />
            <Route
              path="/cart"
              element={
                <CartPage cartCount={cartCount} setCartCount={setCartCount} />
              }
            />
            <Route path="/order-Status" element={<OrderSuccess />} />
            <Route path="/userReview" element={<UserReview />} />
            <Route path="/userProfile" element={<UserProfiles />} />
          </Route>
        </Routes>
      </div>

      {!hideChrome && (
        <>
          <Footer />
          <MobileBottomNav cartCount={cartCount} />
        </>
      )}
    </>
  );
}

export default App;
