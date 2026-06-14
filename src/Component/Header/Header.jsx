import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {Bell,ChevronDown,LogOut,MapPin,Menu,Phone,ShoppingCart,User,X,} from "lucide-react";
import Logo from "../../assets/foodFlow.png";
import { useMenu } from "../../ContextProvider/MenuContext";
import LogoutModal from "../CommanComponent/LogoutModal";
import { useAlert } from "../../ContextProvider/AlertContext";
import { getCategoryImageUrl } from "../Utiles/mediaUrl";

const Header = ({ cartCount, setCartCount }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { categories = [] } = useMenu();
  const { showAlert } = useAlert();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("Guest");
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const closeMenuTimeoutRef = useRef(null);

  const syncAuthState = () => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("userName");
    setIsLoggedIn(!!token);
    setUserName(username || "Guest");
  };

  useEffect(() => {
    syncAuthState();
    setShowDropdown(false);
    setIsMobileNavOpen(false);
    setIsMobileCategoriesOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleStorage = () => syncAuthState();
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    return () => {
      if (closeMenuTimeoutRef.current) {
        clearTimeout(closeMenuTimeoutRef.current);
      }
    };
  }, []);

  const scheduleCloseMenu = () => {
    closeMenuTimeoutRef.current = setTimeout(() => {
      setIsMenuOpen(false);
    }, 150);
  };

  const cancelCloseMenu = () => {
    if (closeMenuTimeoutRef.current) {
      clearTimeout(closeMenuTimeoutRef.current);
      closeMenuTimeoutRef.current = null;
    }
    setIsMenuOpen(true);
  };

  const isHomeActive = location.pathname === "/";
  const isMenuActive =
    location.pathname === "/detail-Items" || location.pathname === "/cart";

  const navLinkClass = (isActive) =>
    `transition ${
      isActive
        ? "text-yellow-300 font-semibold border-b-2 border-yellow-300 pb-1"
        : "hover:text-yellow-300"
    }`;

  const openCategoryPage = (category) => {
    setIsMenuOpen(false);
    setIsMobileNavOpen(false);
    navigate("/detail-Items", {
      state: {
        selectedCategory: category,
        categories,
        showTabs: true,
      },
    });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowDropdown(false);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("imageurl");
    localStorage.removeItem("cartId");
    localStorage.removeItem("restaurantId");
    if (setCartCount) setCartCount(0);
    showAlert("Logout successful!", "success");
    setTimeout(() => navigate("/login"), 700);
  };

  return (
    <>
      <header className="bg-[#B52929] text-white sticky top-0 z-50 shadow-md">
        <div className="container mx-auto px-4 lg:px-6">
          <nav className="flex items-center justify-between py-4 relative min-h-[84px]">
            <div className="flex items-center gap-3 xl:hidden">
              <button
                type="button"
                onClick={() => setIsMobileNavOpen(true)}
                className="inline-flex items-center justify-center w-10 h-10 rounded-lg hover:bg-white/10 transition cursor-pointer"
                aria-label="Open menu"
              >
                <Menu size={22} />
              </button>
            </div>

            <ul className="hidden xl:flex items-center gap-6">
              <li>
                <Link to="/" className={navLinkClass(isHomeActive)}>
                  Home
                </Link>
              </li>
              <li
                className="relative"
                onMouseEnter={cancelCloseMenu}
                onMouseLeave={scheduleCloseMenu}
              >
                <button
                  className={`flex items-center gap-1 cursor-pointer ${navLinkClass(
                    isMenuActive,
                  )}`}
                >
                  Menu <ChevronDown size={14} />
                </button>
                {isMenuOpen && (
                  <div
                    className="absolute top-full left-0 w-[92vw] max-w-6xl pt-3"
                    onMouseEnter={cancelCloseMenu}
                    onMouseLeave={scheduleCloseMenu}
                  >
                    <div className="bg-white text-black rounded-2xl shadow-2xl p-5">
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {categories.map((category) => {
                          const catImg = getCategoryImageUrl(category);
                          return (
                            <div key={category._id}>
                              <button
                                onClick={() => openCategoryPage(category)}
                                className="w-full text-left cursor-pointer group"
                              >
                                <div className="font-semibold text-base capitalize pb-2 border-b border-gray-200 group-hover:text-[#B52929]">
                                  {category.name}
                                </div>
                                <div className="mt-3 mb-2 aspect-[4/3] w-full overflow-hidden rounded-lg bg-gray-100">
                                  {catImg ? (
                                    <img
                                      src={catImg}
                                      alt=""
                                      className="h-full w-full object-cover"
                                      loading="lazy"
                                    />
                                  ) : (
                                    <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                                      {category.name?.[0] ?? "?"}
                                    </div>
                                  )}
                                </div>
                              </button>
                              <ul className="mt-2 space-y-1">
                                {(category.items || [])
                                  .slice(0, 6)
                                  .map((item) => (
                                    <li key={item._id}>
                                      <button
                                        onClick={() =>
                                          openCategoryPage(category)
                                        }
                                        className="text-sm text-gray-700 hover:text-[#B52929] transition cursor-pointer"
                                      >
                                        {item.name}
                                      </button>
                                    </li>
                                  ))}
                              </ul>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </li>
              <li>
                <Link
                  to="/about"
                  className={navLinkClass(location.pathname === "/about")}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className={navLinkClass(location.pathname === "/faq")}
                >
                  FAQ
                </Link>
              </li>
            </ul>

            <Link
              to="/"
              className="lg:absolute lg:left-1/2 lg:-translate-x-1/2"
              aria-label="Food Flow home"
            >
              <div className="flex items-center gap-2">
                <img
                  src={Logo}
                  alt="Food Flow logo"
                  className="w-40 sm:w-40 object-contain"
                />
              </div>
            </Link>

            <div className="flex items-center gap-4 lg:gap-6">
              <div className="hidden xl:flex items-center gap-2">
                <Phone size={18} />
                <div className="text-right leading-tight">
                  <p className="text-xs">Order In Now</p>
                  <p className="font-semibold text-sm">6354296164</p>
                </div>
              </div>

              <button
                onClick={() => navigate("/cart")}
                className="hidden md:flex relative hover:text-yellow-300 cursor-pointer"
              >
                <ShoppingCart size={20} />
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount ?? 0}
                </span>
              </button>

              {isLoggedIn ? (
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown((prev) => !prev)}
                    className="flex items-center gap-2 cursor-pointer hover:text-yellow-300"
                  >
                    <User size={18} />
                    <span className="hidden sm:block text-sm capitalize">
                      {userName}
                    </span>
                  </button>
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 bg-white text-black rounded-lg shadow-lg w-40 py-2">
                      <Link
                        to="/userProfile"
                        onClick={() => setShowDropdown(false)}
                        className="block px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        Profile
                      </Link>
                      <button
                        onClick={() => setIsLogoutOpen(true)}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
                      >
                        <LogOut size={15} /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="bg-yellow-400 text-black px-4 py-1.5 rounded-full font-semibold hover:bg-yellow-300 transition"
                >
                  Login
                </Link>
              )}
            </div>
          </nav>
        </div>
        <div className="border-t border-black/10 bg-[#9e2328] xl:hidden">
          <div className=" container mx-auto flex items-center justify-between gap-3 px-4 py-2.5 lg:px-6">
            <div className="flex min-w-0 flex-1 items-center gap-2.5">
              <MapPin
                className="h-4 w-4 shrink-0 text-[#F5CA48]"
                strokeWidth={2.2}
              />
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-white/75">
                  Delivering now Using 
                </p>
                <p className="truncate text-sm font-bold text-white">
                  Food Flow • Fresh & Fast
                </p>
              </div>
            </div>
            <button
              type="button"
              className="hidden shrink-0 rounded-xl border border-white/25 bg-white/10 p-2.5 text-white transition hover:bg-white/20"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" strokeWidth={2.2} />
            </button>
          </div>
        </div>
      </header>

      {isMobileNavOpen && (
        <div className="fixed inset-0 z-[70] xl:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsMobileNavOpen(false)}
            aria-label="Close menu overlay"
          />
          <div className="absolute top-0 left-0 h-full w-[85vw] max-w-sm bg-white text-black shadow-2xl">
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
              <Link
                to="/"
                onClick={() => setIsMobileNavOpen(false)}
                className="flex items-center gap-2"
              >
                <img
                  src={Logo}
                  alt="Food Flow logo"
                  className="w-24 object-contain"
                />
              </Link>
              <button
                type="button"
                onClick={() => setIsMobileNavOpen(false)}
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-72px)]">
              <Link
                to="/"
                onClick={() => setIsMobileNavOpen(false)}
                className="block px-3 py-2 rounded-lg hover:bg-gray-100 font-medium"
              >
                Home
              </Link>

              <button
                type="button"
                onClick={() => setIsMobileCategoriesOpen((p) => !p)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-100 font-medium cursor-pointer"
                aria-expanded={isMobileCategoriesOpen}
              >
                <span>Menu</span>
                <ChevronDown
                  size={18}
                  className={`transition-transform ${isMobileCategoriesOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isMobileCategoriesOpen && (
                <div className="pl-2 pr-1 pb-2">
                  <div className="grid grid-cols-1 gap-1">
                    {categories.map((category) => {
                      const catImg = getCategoryImageUrl(category);
                      return (
                        <button
                          key={category._id}
                          onClick={() => openCategoryPage(category)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 text-left capitalize cursor-pointer"
                        >
                          <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                            {catImg ? (
                              <img
                                src={catImg}
                                alt=""
                                className="h-full w-full object-cover"
                                loading="lazy"
                              />
                            ) : (
                              <span className="flex h-full w-full items-center justify-center text-xs font-semibold text-gray-500">
                                {category.name?.[0] ?? "?"}
                              </span>
                            )}
                          </span>
                          <span className="font-medium">{category.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <Link
                to="/about"
                onClick={() => setIsMobileNavOpen(false)}
                className="block px-3 py-2 rounded-lg hover:bg-gray-100 font-medium"
              >
                About
              </Link>
              <Link
                to="/faq"
                onClick={() => setIsMobileNavOpen(false)}
                className="block px-3 py-2 rounded-lg hover:bg-gray-100 font-medium"
              >
                FAQ
              </Link>

              <div className="pt-3 mt-3 border-t border-gray-200">
                {isLoggedIn ? (
                  <div className="space-y-2">
                    <Link
                      to="/userProfile"
                      onClick={() => setIsMobileNavOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 font-medium"
                    >
                      <User size={18} />
                      Profile
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMobileNavOpen(false);
                        setIsLogoutOpen(true);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 font-medium cursor-pointer"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsMobileNavOpen(false)}
                    className="inline-flex items-center justify-center w-full bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <LogoutModal
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  );
};

export default Header;
