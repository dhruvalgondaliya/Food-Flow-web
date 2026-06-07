import { useEffect, useState } from "react";
import axios from "axios";
import {
  Minus,
  Plus,
  Trash2,
  MapPin,
  CreditCard,
  ChevronRight,
} from "lucide-react";
import PageBreadcrumb from "../Component/CommanComponent/PageBreadcrumb";
import { API_URL } from "../Component/Server/Server";
import { Link, useNavigate } from "react-router-dom";
import OrderSuccessModal from "../Component/CommanComponent/OrderSuccessModal";
import { formatCurrency } from "../Component/Utiles/Currency";
import { useAlert } from "../ContextProvider/AlertContext";
import { authHeader } from "../Component/Utiles/authHeader";
import { fetchCoupons } from "../Component/Api/CartApi";
import { CouponCard } from "../Component/CommanComponent/CouponCard";
import Popup from "../Component/CommanComponent/Popup.jsx";
import Loader from "../Component/CommanComponent/Loader";

export default function FoodCartPage({ setCartCount }) {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const [cartId, setCartId] = useState(null);

  const [loadingCity, setLoadingCity] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  // const cartId = localStorage.getItem("cartId");
  const [subTotal, setSubTotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");
  const [showCouponPopup, setShowCouponPopup] = useState(false);
  const [allCoupons, setAllCoupons] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [restaurantName, setRestaurantName] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState({
    FullName: "",
    PhoneNumber: "",
    Address: "",
    City: "",
    ZIPCode: "",
    Landmark: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
  });

  const isDeliveryValid = () => {
    const { FullName, PhoneNumber, Address, City, ZIPCode } = deliveryAddress;
    return (
      FullName.trim() !== "" &&
      PhoneNumber.trim().length === 10 &&
      Address.trim() !== "" &&
      City.trim() !== "" &&
      ZIPCode.trim().length === 6
    );
  };

  // Get Cart Items Api
  // const fetchCart = async () => {
  //   const userId = localStorage.getItem("userId");
  //   const token = localStorage.getItem("token");

  //   if (!token || !userId) {
  //     showAlert("Please log in to view your cart.", "error");
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     const res = await axios.get(`${API_URL}cart/fetch/${userId}`,authHeader());

  //     console.log("testing cart data :", res.data);

  //     const cart = res.data.data;
  //     console.log("===================",cart.items);

  //     setCartCount(cart.cartLength || 0);
  //     setRestaurantName(cart.restaurantId.name);

  //     if (cart && cart.items && cart.items.length > 0) {
  //       setSubTotal(cart.subTotal);
  //       setTaxAmount(cart.taxAmount || 0);
  //       setTotal(cart.totalAmount || 0);
  //       setDiscount(cart.discount || 0);
  //       setCartItems(cart.items || []);

  //       //Save cartId
  //       localStorage.setItem("cartId", cart._id);

  //       // Save restaurantId
  //       if (cart.items[0]?.restaurantId) {
  //         localStorage.setItem("restaurantId", cart.items[0].restaurantId);
  //       }
  //     } else {
  //       setSubTotal(0);
  //       setTaxAmount(0);
  //       setTotal(0);
  //       setDiscount(0);
  //       setCartItems([]);
  //       localStorage.removeItem("cartId");
  //       localStorage.removeItem("restaurantId");
  //     }
  //   } catch (err) {
  //     setSubTotal(0);
  //     setTaxAmount(0);
  //     setTotal(0);
  //     setCartItems([]);

  //     localStorage.removeItem("cartId");
  //     localStorage.removeItem("restaurantId");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchCart();
  // }, []);

  const fetchCart = async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!token || !userId) return;

    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}cart/fetch/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const cart = res.data?.data;
      if (!cart || !cart.items?.length) {
        setCartItems([]);
        return;
      }

      setCartItems([...cart.items]);
      setSubTotal(cart.subTotal || 0);
      setTaxAmount(cart.taxAmount || 0);
      setDiscount(cart.discount || 0);
      setTotal(cart.totalAmount || 0);

      setCartId(cart._id);
      localStorage.setItem("cartId", cart._id);

      const restaurantId =
        cart.restaurantId?._id || cart.restaurantId || cart.items[0]?.restaurantId;
      const restaurantNameFromCart =
        cart.restaurantId?.name || cart.restaurantName || cart.items[0]?.restaurantId?.name;

      if (restaurantId) {
        localStorage.setItem("restaurantId", restaurantId);
      }
      setRestaurantName(restaurantNameFromCart || "Charcoal Chicken");
    } catch (err) {
      console.error("Cart error", err);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
    // setCartId(cart._id);
  }, []);

  // Update cart Items Api
  const updateQuantity = async (cartItemId, change) => {
    try {
      const userId = localStorage.getItem("userId");
      const itemIndex = cartItems.findIndex((i) => i._id === cartItemId);
      if (itemIndex === -1) return;

      const newQty = cartItems[itemIndex].quantity + change;
      if (newQty < 1) return;

      setCartItems((prev) =>
        prev.map((i, idx) =>
          idx === itemIndex ? { ...i, quantity: newQty } : i
        )
      );

      const res = await axios.put(
        `${API_URL}cart/update-cart/${userId}/${cartItemId}`,
        { quantity: newQty },
        authHeader()
      );

      const updatedCart = res.data.data;

      if (updatedCart) {
        // Update totals including subtotal
        setSubTotal(
          updatedCart.subTotal ||
            updatedCart.totalAmountBeforeTax ||
            updatedCart.items?.reduce((acc, item) => {
              const price = item.menuItemId?.price || 0;
              const variantPrice = item.variant?.price || 0;
              return acc + (price + variantPrice) * item.quantity;
            }, 0)
        );

        setTaxAmount(updatedCart.taxAmount || 0);
        setTotal(updatedCart.totalAmount || 0);
      }
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  // Delete cartItem api
  const deleteCartItem = async (cartId, menuItemId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(
        `${API_URL}cart/delete-cart/${cartId}/${menuItemId}`,
        authHeader()
      );
      showAlert("cart item deleted successfully", "success");
      if (setCartCount) setCartCount((prev) => Math.max(prev - 1, 0));
      await fetchCart();
    } catch (error) {
      console.log("Failed to delete cart item", error);
    }
  };

  const handleCardInfoChange = (field, value) => {
    setCardInfo((prev) => ({ ...prev, [field]: value }));
  };

  // step title function
  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Cart";
      case 2:
        return "Checkout";
      case 3:
        return "Payment";
      default:
        return "Cart";
    }
  };

  // top button function
  const proceedToNextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const goBackToPreviousStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.getElementById("razorpay-script")) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.id = "razorpay-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  // create Order with Razorpay api
  const addToOrder = async (cartId) => {
    const userId = localStorage.getItem("userId");

    if (paymentMethod === "Razorpay") {
      // Razorpay Script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        showAlert("Failed to load Razorpay. Please try again.", "error");
        return;
      }

      const amount = total * 100;
      const options = {
        key: "rzp_test_RJRpnryKgq8b19", // Test Key
        amount: amount,
        currency: "INR",
        name: restaurantName,
        description: "Order Payment",
        handler: async function (response) {
          try {
            const res = await axios.post(
              `${API_URL}order/createOrder/${userId}/${cartId}`,
              {
                deliveryAddress,
                paymentMethod: "Razorpay",
                razorpayPaymentId: response.razorpay_payment_id,
              },
              authHeader()
            );
            if (
              res.status === 201 &&
              res.data.message === "Order placed successfully"
            ) {
              setSuccessModalOpen(true);
              showAlert("Order placed successfully", "success");
              setTimeout(() => {
                setSuccessModalOpen(false);
                navigate("/order-Status");
              }, 2000);
            }
          } catch (error) {
            const errMessage =
              error.response?.data?.message || "Failed to place order";
            showAlert(errMessage, "error");
          }
        },
        prefill: {
          name: deliveryAddress.FullName,
          contact: deliveryAddress.PhoneNumber,
        },
        theme: {
          color: "#F59E42",
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
      return;
    }

    // Order Api
    try {
      const res = await axios.post(
        `${API_URL}order/createOrder/${userId}/${cartId}`,
        {
          deliveryAddress,
          paymentMethod,
        },
        authHeader()
      );

      if (
        res.status === 201 &&
        res.data.message === "Order placed successfully"
      ) {
        setSuccessModalOpen(true);
        showAlert("Order placed successfully", "success");
        setTimeout(() => {
          setSuccessModalOpen(false);
          navigate("/order-Status");
        }, 2000);
      }
    } catch (error) {
      const errMessage =
        error.response?.data?.message || "Failed to place order";
      showAlert(errMessage, "error");
    }
  };

  // fetch pincode
  const fetchCityByPincode = async (pincode) => {
    if (pincode.length !== 6) return;
    try {
      setLoadingCity(true);
      const res = await axios.get(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      const data = res.data[0];
      if (data.Status === "Success" && data.PostOffice?.length > 0) {
        setDeliveryAddress((prev) => ({
          ...prev,
          City: data.PostOffice[0].District,
        }));
      }
    } catch (error) {
      console.error("Invalid Pincode:", error);
    } finally {
      setLoadingCity(false);
    }
  };

  const handleOpenCoupons = async () => {
    const restaurantId = localStorage.getItem("restaurantId");
    console.log("Restaurant ID for coupons:", restaurantId);

    try {
      const res = await fetchCoupons(restaurantId);
      setAllCoupons(res.data);
      setShowCouponPopup(true);
    } catch (error) {
      console.error("Failed to fetch coupons", error);
    }
  };

  // Coupon Api
  const applyCoupon = async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!token || !code || typeof code !== "string" || !code.trim()) {
      showAlert("Please enter a valid coupon code.", "error");
      return;
    }

    if (selectedCoupon && total < selectedCoupon.minOrderAmount) {
      showAlert(
        `Coupon valid only for orders above ₹${selectedCoupon.minOrderAmount}`,
        "error"
      );
      return;
    }

    try {
      const res = await axios.post(
        `${API_URL}cart/apply-coupon/${userId}`,
        { code: code.trim().toUpperCase() },
        authHeader()
      );

      const cart = res.data.data;

      console.log("testing ",res.data);
      

      showAlert(
        `Coupon ${code} applied! Discount: ₹${cart.discount}`,
        "success"
      );

      setSubTotal(cart.totalAmountBeforeTax || 0);
      setTaxAmount(cart.taxAmount || 0);
      setTotal(cart.totalAmount || 0);
      setDiscount(cart.discount || 0);
      setCartItems(cart.items || []);

      setCode("");
      setSelectedCoupon(null);
      setShowCouponPopup(false);
    } catch (err) {
      showAlert(
        err.response?.data?.message || "Failed to apply coupon",
        "error"
      );
      setDiscount(0);
    }
  };

  return (
    <>
      <div className="min-h-screen py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between gap-3">
            <PageBreadcrumb pageTitle="Cart Page" />
            <Link
              to="/order-Status"
              className="inline-flex items-center justify-center h-11 px-5 rounded-xl bg-gradient-to-r from-[#B52929] to-[#e04747] text-white font-semibold shadow-md hover:shadow-lg transition-all hover:-translate-y-[1px] active:translate-y-0 whitespace-nowrap"
            >
              Go to Order
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {getStepTitle()}
            </h1>
            <div className="flex items-center gap-3 sm:gap-6">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="flex items-center gap-2 cursor-pointer"
                aria-label="Go to Cart step"
              >
                <span
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${
                    currentStep >= 1
                      ? "bg-[#B52929] text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  1
                </span>
                <span
                  className={`font-semibold ${
                    currentStep >= 1 ? "text-gray-900" : "text-gray-600"
                  }`}
                >
                  Cart
                </span>
              </button>

              <div className="h-px bg-gray-300 flex-1 max-w-14" />

              <button
                type="button"
                onClick={() => {
                  if (currentStep >= 2) setCurrentStep(2);
                }}
                disabled={currentStep < 2}
                className="flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                aria-label="Go to Checkout step"
              >
                <span
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${
                    currentStep >= 2
                      ? "bg-[#B52929] text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  2
                </span>
                <span
                  className={`font-semibold ${
                    currentStep >= 2 ? "text-gray-900" : "text-gray-600"
                  }`}
                >
                  Checkout
                </span>
              </button>

              <div className="h-px bg-gray-300 flex-1 max-w-14" />

              <button
                type="button"
                onClick={() => {
                  if (currentStep >= 3) setCurrentStep(3);
                }}
                disabled={currentStep < 3}
                className="flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                aria-label="Go to Payment step"
              >
                <span
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${
                    currentStep >= 3
                      ? "bg-[#B52929] text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  3
                </span>
                <span
                  className={`font-semibold ${
                    currentStep >= 3 ? "text-gray-900" : "text-gray-600"
                  }`}
                >
                  Payment
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {currentStep === 1 && (
                <div className="space-y-4">
                  {loading ? (
                    <Loader label="Loading cart..." />
                  ) : cartItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center py-10 text-gray-500">
                      <span className="text-2xl">🛒</span>
                      <p className="mt-2 text-lg">Your cart is empty</p>
                    </div>
                  ) : (
                    cartItems.map((item) => (
                      <div
                        key={item._id}
                        className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-100"
                      >
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="flex-shrink-0 mx-auto sm:mx-0">
                            <img
                              src={item.menuItemId.imageUrl || "/placeholder-image.png"}
                              alt={item.menuItemId.name}
                              className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-lg"
                            />
                          </div>
                          <div className="flex-1 text-center sm:text-left">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
                              Name: {item.menuItemId.name}
                            </h3>
                            <p className="text-gray-600 text-sm mb-2">
                              <span className="text-black font-bold">
                                Description:
                              </span>{" "}
                              {item.menuItemId.description}
                            </p>
                            {item.variant.size ? (
                              <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-sm text-gray-500 mb-3">
                                <span>
                                  Size:{" "}
                                  <span className="font-medium text-gray-700">
                                    {item.variant.size}
                                  </span>
                                </span>
                              </div>
                            ) : null}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                              <div className="flex items-center justify-center sm:justify-start gap-2">
                                <span className="text-xl font-bold text-gray-900">
                                  Price: ₹
                                  {item.variant && item.variant.price
                                    ? item.variant.price.toFixed(2)
                                    : (item.price || 0).toFixed(2)}{" "}
                                </span>
                              </div>
                              <div className="flex items-center justify-center sm:justify-end gap-3">
                                <div className="flex items-center border border-gray-200 rounded-lg">
                                  <button
                                    onClick={() => updateQuantity(item._id, -1)}
                                    className={`p-2 transition-colors ${
                                      item.quantity <= 1
                                        ? "text-gray-400 cursor-not-allowed"
                                        : "hover:bg-gray-50 cursor-pointer"
                                    }`}
                                    disabled={item.quantity <= 1}
                                  >
                                    <Minus className="w-4 h-4" />
                                  </button>
                                  <span className="px-4 py-2 font-medium min-w-12 text-center">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => updateQuantity(item._id, +1)}
                                    className="p-2 hover:bg-gray-50 transition-colors cursor-pointer"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                </div>
                                <button
                                  onClick={() =>
                                    deleteCartItem(cartId, item.menuItemId._id)
                                  }
                                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {currentStep === 2 && (
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Delivery Information
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={deliveryAddress.FullName}
                        onChange={(e) =>
                          setDeliveryAddress({
                            ...deliveryAddress,
                            FullName: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        maxLength={10}
                        value={deliveryAddress.PhoneNumber}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          if (value.length <= 10) {
                            setDeliveryAddress({
                              ...deliveryAddress,
                              PhoneNumber: value,
                            });
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                      </label>
                      <textarea
                        value={deliveryAddress.Address}
                        onChange={(e) =>
                          setDeliveryAddress({
                            ...deliveryAddress,
                            Address: e.target.value,
                          })
                        }
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Enter your full address"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        value={deliveryAddress.City}
                        onChange={(e) =>
                          setDeliveryAddress({
                            ...deliveryAddress,
                            City: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Enter your city"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        value={deliveryAddress.ZIPCode}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          if (value.length <= 6) {
                            setDeliveryAddress({
                              ...deliveryAddress,
                              ZIPCode: value,
                            });
                            if (value.length === 6) {
                              fetchCityByPincode(value);
                            }
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                        placeholder="Enter ZIP code"
                      />
                      {loadingCity && (
                        <p className="text-sm text-gray-500 mt-1">
                          Fetching city...
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Payment Method
                  </h2>
                  <div className="space-y-3 mb-6">
                    <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="payment"
                        value="card"
                        checked={paymentMethod === "card"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <CreditCard className="w-5 h-5 mr-3 text-gray-600" />
                      <span className="font-medium">Credit/Debit Card</span>
                    </label>
                    <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="payment"
                        value="Razorpay"
                        checked={paymentMethod === "Razorpay"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <div className="w-5 h-5 mr-3 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
                        R
                      </div>
                      <span className="font-medium">Razorpay</span>
                    </label>
                    <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={paymentMethod === "cod"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <div className="w-5 h-5 mr-3 bg-green-600 rounded text-white text-xs flex items-center justify-center font-bold">
                        $
                      </div>
                      <span className="font-medium">Cash on Delivery</span>
                    </label>
                  </div>

                  {paymentMethod === "card" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Card Number
                        </label>
                        <input
                          type="text"
                          value={cardInfo.cardNumber}
                          onChange={(e) =>
                            handleCardInfoChange("cardNumber", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="1234 5678 9012 3456"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          value={cardInfo.expiryDate}
                          onChange={(e) =>
                            handleCardInfoChange("expiryDate", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CVV
                        </label>
                        <input
                          type="text"
                          value={cardInfo.cvv}
                          onChange={(e) =>
                            handleCardInfoChange("cvv", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="123"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Name on Card
                        </label>
                        <input
                          type="text"
                          value={cardInfo.nameOnCard}
                          onChange={(e) =>
                            handleCardInfoChange("nameOnCard", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="Enter name as on card"
                        />
                      </div>
                    </div>
                  )}

                  {paymentMethod === "Razorpay" && (
                    <div className="text-center py-8">
                      <div className="text-gray-600 mb-4">
                        You will be redirected to Razorpay to complete your
                        payment
                      </div>
                      <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto flex items-center justify-center">
                        <div className="text-blue-600 font-bold text-xl">
                          Razorpay
                        </div>
                      </div>
                    </div>
                  )}
                  {paymentMethod === "cod" && (
                    <div className="text-center py-8">
                      <div className="text-gray-600 mb-4">
                        Pay when your order is delivered
                      </div>
                      <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center">
                        <div className="text-green-600 font-bold text-2xl">
                          $
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Oreder Summary */}
            {cartItems.length === 0 ? (
              ""
            ) : (
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 sticky top-4">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Order Summary
                  </h2>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sub Total</span>
                      <span className="font-medium">
                        {formatCurrency(subTotal || 0)}
                      </span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Discount Applied</span>
                        <span className="font-medium text-green-600">
                          - ₹{discount}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax (5%)</span>
                      <span className="font-medium">
                        {formatCurrency(taxAmount || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Charge</span>
                      <span className="font-medium text-orange-600">
                        {cartItems.length > 0
                          ? subTotal >= 300
                            ? "Free"
                            : "₹30.00"
                          : "₹0.00"}
                      </span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>{formatCurrency(total || 0)}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (!isDeliveryValid() && currentStep === 2) {
                        alert("Please fill all required delivery fields");
                        return;
                      }
                      if (currentStep < 3) {
                        proceedToNextStep();
                      } else {
                        addToOrder(cartId);
                      }
                    }}
                    className={`w-full py-3 rounded-xl font-semibold mb-4 transition-all ${
                      isDeliveryValid() || currentStep !== 2
                        ? "bg-[#B52929] text-white hover:bg-[#9f2323] shadow-sm hover:shadow-md cursor-pointer"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    disabled={currentStep === 2 && !isDeliveryValid()}
                  >
                    {currentStep === 1
                      ? "Proceed to Checkout"
                      : currentStep === 2
                      ? "Continue to Payment"
                      : "Place Order"}
                  </button>
                  <OrderSuccessModal
                    isOpen={successModalOpen}
                    onClose={() => {
                      setShowSuccessModal(false);
                      navigate("/order-Status");
                    }}
                  />
                  {currentStep > 1 && (
                    <button
                      onClick={goBackToPreviousStep}
                      className="w-full bg-white text-gray-900 py-3 rounded-xl font-semibold border border-gray-300 hover:bg-gray-50 transition mb-6 cursor-pointer"
                    >
                      Back to {currentStep === 2 ? "Cart" : "Checkout"}
                    </button>
                  )}
                  {currentStep === 3 && (
                    <>
                      <div
                        className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow duration-200 flex items-center justify-between"
                        onClick={handleOpenCoupons}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              %
                            </span>
                          </div>
                          <div>
                            <h3 className="text-cyan-600 font-semibold">
                              Select Offer/Apply Coupon
                            </h3>
                            <p className="text-gray-500 text-sm">
                              Get discount with your order
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </>
                  )}

                  {/* Coupon Popup */}
                  <Popup
                    isOpen={showCouponPopup}
                    onClose={() => setShowCouponPopup(false)}
                    title="Available Coupons"
                    width="max-w-[500px]"
                  >
                    <div className="space-y-4">
                      <div className="flex gap-2 items-end">
                        <div className="w-1/1">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Coupon Code
                          </label>
                          <input
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-700 h-[42px]"
                            placeholder="Coupon Code"
                          />
                        </div>

                        <button
                          onClick={applyCoupon}
                          className="self-end h-[42px] bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 whitespace-nowrap cursor-pointer"
                        >
                          Confirm
                        </button>
                      </div>

                      {allCoupons.filter(
                        (coupon) => new Date(coupon.expiryDate) > new Date()
                      ).length > 0 ? (
                        allCoupons
                          .filter(
                            (coupon) => new Date(coupon.expiryDate) > new Date()
                          )
                          .map((coupon) => (
                            <CouponCard
                              key={coupon._id}
                              coupon={coupon}
                              onApply={(coupon) => {
                                setSelectedCoupon(coupon);
                                setCode(coupon.code);
                              }}
                            />
                          ))
                      ) : (
                        <div className="text-center py-12">
                          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                            <svg
                              className="w-8 h-8 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                              />
                            </svg>
                          </div>
                          <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                            No coupons available
                          </p>
                          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                            Check back later for exciting offers!
                          </p>
                        </div>
                      )}
                    </div>
                  </Popup>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
