import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, LayoutGrid, ShoppingBag, User } from "lucide-react";
import { useMenu } from "../../ContextProvider/MenuContext";

const MobileBottomNav = ({ cartCount = 0 }) => {
  const path = useLocation().pathname;
  const navigate = useNavigate();
  const { categories = [] } = useMenu();
  const token =
    typeof localStorage !== "undefined" && localStorage.getItem("token");

  const goMenu = () => {
    navigate("/detail-Items", {
      state: { categories, showTabs: true },
    });
  };

  const items = [
    {
      key: "home",
      label: "Home",
      render: () => (
        <Link
          to="/"
          className="flex flex-1 flex-col items-center rounded-2xl py-1.5 transition active:scale-[0.97]"
        >
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-2xl transition ${
              path === "/"
                ? "bg-[#F5CA48] text-gray-900 shadow-md"
                : "text-gray-400"
            }`}
          >
            <Home className="h-5 w-5" strokeWidth={2.2} />
          </span>
          <span
            className={`mt-0.5 text-[10px] font-bold uppercase tracking-wide ${
              path === "/" ? "text-[#F5CA48]" : "text-gray-500"
            }`}
          >
            Home
          </span>
        </Link>
      ),
    },
    {
      key: "menu",
      label: "Menu",
      render: () => (
        <button
          type="button"
          onClick={goMenu}
          className="flex flex-1 flex-col items-center rounded-2xl py-1.5 transition active:scale-[0.97] cursor-pointer"
        >
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-2xl transition ${
              path === "/detail-Items"
                ? "bg-[#F5CA48] text-gray-900 shadow-md"
                : "text-gray-400"
            }`}
          >
            <LayoutGrid className="h-5 w-5" strokeWidth={2.2} />
          </span>
          <span
            className={`mt-0.5 text-[10px] font-bold uppercase tracking-wide ${
              path === "/detail-Items"
                ? "text-[#F5CA48]"
                : "text-gray-500"
            }`}
          >
            Menu
          </span>
        </button>
      ),
    },
    {
      key: "cart",
      label: "Cart",
      render: () => (
        <Link
          to="/cart"
          className="flex flex-1 flex-col items-center rounded-2xl py-1.5 transition active:scale-[0.97]"
        >
          <span
            className={`relative flex h-10 w-10 items-center justify-center rounded-2xl transition ${
              path === "/cart"
                ? "bg-[#F5CA48] text-gray-900 shadow-md"
                : "text-gray-400"
            }`}
          >
            <ShoppingBag className="h-5 w-5" strokeWidth={2.2} />
            {cartCount > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-[#B52929] px-1 text-[9px] font-bold text-white ring-2 ring-[#141211]">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            ) : null}
          </span>
          <span
            className={`mt-0.5 text-[10px] font-bold uppercase tracking-wide ${
              path === "/cart" ? "text-[#F5CA48]" : "text-gray-500"
            }`}
          >
            Cart
          </span>
        </Link>
      ),
    },
    {
      key: "profile",
      label: token ? "Profile" : "Login",
      render: () => (
        <Link
          to={token ? "/userProfile" : "/login"}
          className="flex flex-1 flex-col items-center rounded-2xl py-1.5 transition active:scale-[0.97]"
        >
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-2xl transition ${
              path === "/userProfile" || path === "/login"
                ? "bg-[#F5CA48] text-gray-900 shadow-md"
                : "text-gray-400"
            }`}
          >
            <User className="h-5 w-5" strokeWidth={2.2} />
          </span>
          <span
            className={`mt-0.5 text-[10px] font-bold uppercase tracking-wide ${
              path === "/userProfile" || path === "/login"
                ? "text-[#F5CA48]"
                : "text-gray-500"
            }`}
          >
            {token ? "Profile" : "Login"}
          </span>
        </Link>
      ),
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-[60] border-t border-white/10 bg-[#141211]/98 backdrop-blur-md xl:hidden"
      aria-label="Mobile"
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-around gap-0.5 px-1 pt-2 pb-[max(0.65rem,env(safe-area-inset-bottom))]">
        {items.map((item) => (
          <div key={item.key} className="min-w-0 flex-1">
            {item.render()}
          </div>
        ))}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
