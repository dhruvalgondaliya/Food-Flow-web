import { useState, useEffect, useRef, useCallback } from "react";
import {
  CheckCircle,
  Clock,
  Truck,
  ChefHat,
  Package,
  Download,
  PackageX,
} from "lucide-react";
import axios from "axios";
import { API_URL } from "../Component/Server/Server";
import { Link } from "react-router-dom";
import PageBreadcrumb from "../Component/CommanComponent/PageBreadcrumb";
import { formatCurrency } from "../Component/Utiles/Currency";
import CancelOrderButton from "../Component/CommanComponent/CancelOrderModal";
import ReviewModal from "../Component/CommanComponent/CommonReview";
import { useAlert } from "../ContextProvider/AlertContext";
import { PreviousOrdersTable } from "../Component/CommanComponent/PreviousOrdersTable";
import { authHeader } from "../Component/Utiles/authHeader";

// Helper: get ETA minutes by status
function getEtaMinutes(status) {
  switch (status) {
    case "pending":
    case "confirmed":
      return 15;
    case "preparing":
      return 10;
    case "on the way":
      return 7;
    default:
      return 0;
  }
}

export default function OrderSuccess() {
  const { showAlert } = useAlert();
  const etaIntervalRef = useRef(null);
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [etaMinutes, setEtaMinutes] = useState(null);
  const [totalOrders, setTotalOrders] = useState(0);
  const [currentStatusIndex, setCurrentStatusIndex] = useState(0);
  // review Model state
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  // Pagination & Search
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [rateLimited, setRateLimited] = useState(false);
  const [retryAfter, setRetryAfter] = useState(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState(null);

  // Accept isEdit and existingReview from PreviousOrdersTable
  const handleOpenReview = (order, isEdit = false, existingReview = null) => {
    setSelectedOrder({ ...order, isEdit, existingReview });
    setIsReviewOpen(true);
  };

  const order = orderData[0];
  const currentOrderStatus = order?.orderStatus?.toLowerCase();
  const isActiveOrder =
    order?.items?.length > 0 &&
    currentOrderStatus !== "delivered" &&
    currentOrderStatus !== "cancelled";

  // Define dynamic progress steps
  const statusMapping = {
    pending: {
      id: 1,
      title: "Pending",
      description: "Your order is being processed",
      icon: CheckCircle,
      time: "Just now",
    },
    confirmed: {
      id: 2,
      title: "Order Confirmed",
      description: "Your order has been placed successfully",
      icon: CheckCircle,
      time: "Just now",
    },
    preparing: {
      id: 3,
      title: "Preparing",
      description: "Restaurant is preparing your food",
      icon: ChefHat,
      time: "3-5 mins",
    },
    "on the way": {
      id: 4,
      title: "On The Way",
      description: "Your order is on the way",
      icon: Truck,
      time: "5-12 mins",
    },
    delivered: {
      id: 5,
      title: "Delivered",
      description: "Your order has been delivered",
      icon: Package,
      time: "Completed",
    },
  };

  // Ordered list of statuses
  const statusOrder = [
    "pending",
    "confirmed",
    "preparing",
    "on the way",
    "delivered",
  ];

  // Fetch order API
  const fetchOrder = useCallback(async () => {
    setLoading(true);

    const userId = localStorage.getItem("userId");
    try {
      const res = await axios.get(
        `${API_URL}order/userOrder/${userId}?page=${page}&limit=${limit}&search=${searchTerm}`,
        authHeader()
      );

      // Save orders
      setOrderData(Array.isArray(res.data.data) ? res.data.data : []);
      setLastUpdatedAt(new Date());

      // Save pagination info
      if (res.data.pagination) {
        setTotalPages(res.data.pagination.totalPages);
        setTotalOrders(res.data.pagination.totalOrders);
      } else {
        setTotalPages(1);
        setTotalOrders(res.data.data?.length || 0);
      }

      // Status + ETA logic
      if (res.data.data.length > 0) {
        const orderStatus = res.data.data[0].orderStatus?.toLowerCase();
        const statusIndex = statusOrder.indexOf(orderStatus);
        setCurrentStatusIndex(statusIndex >= 0 ? statusIndex + 1 : 1);

        const orderCreated = res.data.data[0].createdAt;
        const etaBase = getEtaMinutes(orderStatus);
        if (orderCreated && etaBase > 0) {
          const createdTime = new Date(orderCreated).getTime();
          const now = Date.now();
          const elapsed = Math.floor((now - createdTime) / 60000);
          setEtaMinutes(Math.max(etaBase - elapsed, 0));
        } else {
          setEtaMinutes(null);
        }
      }
    } catch (err) {
      console.error("Failed to fetch orders", err);
      setOrderData([]);
      setTotalPages(1);
      setTotalOrders(0);
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchTerm]);

  useEffect(() => {
    fetchOrder();
  }, [page, limit, searchTerm]);

  // Auto-refresh order status so admin updates appear without manual refresh
  useEffect(() => {
    const activeStatus = order?.orderStatus?.toLowerCase();
    const isTerminalStatus =
      activeStatus === "delivered" || activeStatus === "cancelled";
    if (isTerminalStatus) return;

    const pollInterval = setInterval(() => {
      fetchOrder();
    }, 8000);

    return () => clearInterval(pollInterval);
  }, [order?.orderStatus, page, limit, searchTerm]);

  // Live ETA countdown
  useEffect(() => {
    if (!order) return;
    const orderStatus = order.orderStatus?.toLowerCase();
    const etaBase = getEtaMinutes(orderStatus);
    if (!order.createdAt || etaBase === 0) {
      setEtaMinutes(null);
      return;
    }
    // Clear previous interval
    if (etaIntervalRef.current) clearInterval(etaIntervalRef.current);
    // Calculate initial
    const createdTime = new Date(order.createdAt).getTime();
    function updateEta() {
      const now = Date.now();
      const elapsed = Math.floor((now - createdTime) / 60000);
      setEtaMinutes(Math.max(etaBase - elapsed, 0));
    }
    updateEta();
    etaIntervalRef.current = setInterval(updateEta, 1000);
    return () => {
      if (etaIntervalRef.current) clearInterval(etaIntervalRef.current);
    };
  }, [order?.createdAt, order?.orderStatus]);

  // Download Receipt
  const downloadReceipt = async (orderId) => {
    if (rateLimited) {
      showAlert(
        `You are rate-limited. Try again in ${retryAfter || 120} seconds.`,
        "warning"
      );
      return;
    }

    try {
      const res = await axios.get(
        `${API_URL}receipt/order/${orderId}/downloadReceipte`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          responseType: "blob",
        }
      );

      // Create blob and download
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `OrderReceipt-${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      if (error.response?.status === 429) {
        const waitTime = error.response.data?.retryAfter || 120;
        setRateLimited(true);
        setRetryAfter(waitTime);

        showAlert(
          `Too many requests! Please wait ${waitTime} seconds.`,
          "warning"
        );

        // auto reset after wait time
        setTimeout(() => {
          setRateLimited(false);
          setRetryAfter(null);
        }, waitTime * 1000);
      } else {
        console.error("Receipt download failed:", error);
        showAlert(
          "Failed to download receipt. Please try again later.",
          "error"
        );
      }
    }
  };

  // cancel Order
  const cancelOrder = async (orderId) => {
    setLoading(true);
    const userId = localStorage.getItem("userId");

    try {
      const res = await axios.put(
        `${API_URL}order/cancelled/${userId}/${orderId}`,
        {},
        authHeader()
      );

      if (res.data.success) {
        showAlert("Order cancelled successfully", "success");
        setSuccess(true);
        setOrderData((prevOrders) =>
          prevOrders.filter((o) => o._id !== orderId)
        );
        return res.data;
      } else {
        showAlert(res.data.message || "Failed to cancel order.", "error");
      }
    } catch (error) {
      showAlert(error.response?.data?.message || error.message, "error");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Generate dynamic progress steps
  const progressSteps = statusOrder.map((status) => statusMapping[status]);

  // Calculate totals
  const subtotal = order?.subTotal ?? order?.subtotal ?? 0;
  const tax = order?.taxAmount ?? 0;
  const deliveryCharge = subtotal >= 300 ? 0 : subtotal > 0 ? 30 : 0;
  // Pagination Controls
  const handlePrevPage = () => setPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <>
      <div className="min-h-screen">
        <div className="container mx-auto max-w-6xl px-4 py-6 md:py-8">
          <PageBreadcrumb pageTitle="Order Page" />

          {/* Order Details Card */}
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            <div className="bg-gray-50/70 rounded-xl p-3 sm:p-4 md:p-6 mb-6">
              {isActiveOrder ? (
                <>
                  {/* Show progress + details */}
                  <div
                    className={`bg-gradient-to-br from-white via-orange-50/40 to-red-50/40 rounded-2xl shadow-xl border border-orange-100 p-4 sm:p-6 md:p-8 mb-8`}
                  >
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 text-center">
                      Order Progress
                    </h2>
                    <p className="text-center text-xs text-gray-500 mb-8">
                      Auto-updating every 8 seconds
                      {lastUpdatedAt
                        ? ` • Last sync ${lastUpdatedAt.toLocaleTimeString()}`
                        : ""}
                    </p>

                    <div className="mb-8">
                      <div className="h-2 bg-orange-100 rounded-full overflow-hidden mb-6">
                        <div
                          className="h-2 bg-gradient-to-r from-[#B52929] to-orange-500 rounded-full transition-all duration-700"
                          style={{
                            width: `${(currentStatusIndex / statusOrder.length) * 100}%`,
                          }}
                        />
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
                        {progressSteps.map((step) => {
                          const IconComponent = step.icon;
                          const isActive = currentStatusIndex >= step.id;
                          const isCurrent = currentStatusIndex === step.id;

                          return (
                            <div
                              key={step.id}
                              className={`rounded-xl border p-3 md:p-4 transition-all duration-300 ${
                                isActive
                                  ? "border-orange-200 bg-white shadow-sm"
                                  : "border-gray-200 bg-gray-50"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div
                                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                    isActive
                                      ? "bg-gradient-to-br from-[#B52929] to-orange-500 text-white"
                                      : "bg-gray-200 text-gray-400"
                                  }`}
                                >
                                  <IconComponent className="w-5 h-5" />
                                </div>
                                {isCurrent && (
                                  <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-semibold">
                                    Live
                                  </span>
                                )}
                              </div>
                              <h4
                                className={`font-semibold text-sm ${
                                  isActive ? "text-[#B52929]" : "text-gray-500"
                                }`}
                              >
                                {step.title}
                              </h4>
                              <p className="text-xs text-gray-600 mt-1 leading-5">
                                {step.description}
                              </p>
                              <p className="text-xs text-gray-500 mt-2">{step.time}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Large ETA Display */}
                    <div className="bg-gradient-to-r from-[#fff8f3] via-[#fff4eb] to-[#fff0e2] rounded-xl p-4 sm:p-6 text-center border border-orange-200 shadow-sm">
                      <div className="flex items-center justify-center mb-2">
                        <Clock className="w-6 h-6 sm:w-7 sm:h-7 text-[#B52929] mr-2" />
                        <span className="text-lg sm:text-xl font-bold text-[#B52929]">
                          Estimated Delivery Time
                        </span>
                      </div>
                      <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-600">
                        {etaMinutes !== null
                          ? etaMinutes > 0
                            ? `${etaMinutes} minute${
                                etaMinutes === 1 ? "" : "s"
                              } left`
                            : "Arriving soon"
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Order Details, Items List, Delivery Address */}
                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5 md:p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                      {/* Left Column - Order Details */}
                      <div>
                        <h3 className="font-bold text-lg text-gray-800 mb-4">
                          Order Details
                        </h3>
                        <div className="grid grid-cols-2 gap-y-3 text-xs sm:text-sm">
                          <span className="text-gray-600">Order ID:</span>
                          <span className="font-semibold">{order?._id}</span>

                          <span className="text-gray-600">Restaurant:</span>
                          <span className="font-semibold">
                            {order?.restaurantId?.name} Restaurant
                          </span>

                          <span className="text-gray-600">Customer:</span>
                          <span className="font-semibold">
                            {order?.deliveryAddress?.FullName}
                          </span>

                          <span className="text-gray-600">Payment Status:</span>
                          <span
                            className={`font-semibold px-2 py-1 rounded-full text-xs border w-fit
                        ${
                          order?.paymentStatus === "paid"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : order?.paymentStatus === "pending"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : order?.paymentStatus === "failed"
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : "bg-gray-50 text-gray-700 border-gray-200"
                        }`}
                          >
                            {order?.paymentStatus}
                          </span>

                          <span className="text-gray-600">Payment Type:</span>
                          <span className="font-semibold">
                            {order?.paymentMethod}
                          </span>

                          <span className="text-gray-600 mb-3">
                            Estimated Time:
                          </span>
                          <span className="font-semibold text-orange-600">
                            10-15
                          </span>
                        </div>
                      </div>

                      {/* Right Column - Date & Time */}
                      <div>
                        <h3 className="font-bold text-lg text-gray-800 mb-4">
                          Date & Time
                        </h3>
                        <div className="grid grid-cols-2 gap-y-3 text-xs sm:text-sm">
                          <span className="text-gray-600">Order Date:</span>
                          <span className="font-semibold">
                            {order?.createdAt
                              ? new Date(order.createdAt).toLocaleDateString()
                              : new Date().toLocaleDateString()}
                          </span>

                          <span className="text-gray-600">Order Time:</span>
                          <span className="font-semibold">
                            {order?.createdAt
                              ? new Date(order.createdAt).toLocaleTimeString()
                              : new Date().toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Items List */}
                    <div className="border-t pt-4 mt-2">
                      <h4 className="font-semibold mb-3">Items Ordered:</h4>
                      <div className="space-y-3">
                        {order?.items?.map((item, index) => {
                          const unitPrice = item.variant?.price ?? item.price;

                          return (
                            <div key={index} className="flex justify-between items-start gap-3">
                              <div className="min-w-0">
                                <span className="font-medium break-words">
                                  {item.menuItemId?.name}{" "}
                                </span>
                                <span className="text-gray-500 ml-2 break-words text-xs sm:text-sm">
                                  *{item.quantity} Price:({unitPrice})
                                </span>
                                {item.variant?.size && (
                                  <span className="text-gray-400 ml-2 text-sm">
                                    (Size: {item.variant.size})
                                  </span>
                                )}
                              </div>
                              <span className="font-semibold whitespace-nowrap text-sm sm:text-base">
                                ₹{unitPrice * item.quantity}
                              </span>
                            </div>
                          );
                        })}

                        <div className="border-t pt-3 mt-4 space-y-2">
                          <div className="flex justify-between text-xs sm:text-sm">
                            <span>Subtotal:</span>
                            <span>
                              ₹{order?.subTotal ?? order?.subtotal ?? 0}
                            </span>
                          </div>

                          <div className="flex justify-between text-xs sm:text-sm">
                            <span>Tax:</span>
                            <span>{formatCurrency(order?.taxAmount ?? 0)}</span>
                          </div>

                          {order?.discount > 0 && (
                            <div className="flex justify-between text-xs sm:text-sm">
                              <span className="text-gray-600">Discount</span>
                              <span className="font-medium text-green-600">
                                - {formatCurrency(order.discount)}
                              </span>
                            </div>
                          )}

                          <div className="flex justify-between text-xs sm:text-sm">
                            <span className="text-gray-600">
                              Delivery Charge
                            </span>
                            <span className="font-medium text-orange-600">
                              {subtotal >= 300
                                ? "Free"
                                : subtotal > 0
                                ? "₹30.00"
                                : "₹0.00"}
                            </span>
                          </div>

                          <div className="flex justify-between font-bold text-base sm:text-lg border-t pt-2">
                            <span>Total:</span>
                            <span className="text-green-600">
                              {formatCurrency(
                                subtotal + tax + deliveryCharge - (order?.discount ?? 0)
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Delivery Address */}
                    <div className="bg-orange-50 rounded-xl p-4 mb-6 border border-orange-100">
                      <h4 className="font-semibold mb-2 text-[#B52929]">
                        Delivery Address:
                      </h4>
                      <p className="text-[#B52929] text-xs sm:text-sm break-words">
                        {order?.deliveryAddress?.Address},{" "}
                        {order?.deliveryAddress?.City}, ZIP:{" "}
                        {order?.deliveryAddress?.ZIPCode}
                      </p>
                    </div>
                    <div className="flex justify-end">
                      <CancelOrderButton
                        orderId={order._id}
                        loading={loading}
                        success={success}
                        cancelOrder={cancelOrder}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Show delivered success */}
                  <div className="text-center py-6 ">
                    {order?.orderStatus?.toLowerCase() === "delivered" ? (
                      <>
                        <p className="text-gray-700 mb-4">
                          Your order has been delivered 🎉
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                          <button
                            onClick={() => downloadReceipt(order?._id)}
                            className="flex bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors"
                          >
                            <Download className="w-5 h-5" /> &nbsp; Download
                            Receipt
                          </button>
                          <Link
                            to="/"
                            className="flex bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors"
                          >
                            Create New Order
                          </Link>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <PackageX className="w-12 h-12 mb-2" />
                        <p>No order found</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* All Order Show Table */}
            <PreviousOrdersTable
              orderData={orderData}
              loading={loading}
              handleOpenReview={handleOpenReview}
              downloadReceipt={downloadReceipt}
              page={page}
              setPage={setPage}
              limit={limit}
              setSearchTerm={setSearchTerm}
              totalOrders={totalOrders}
              handleNextPage={handleNextPage}
              handlePrevPage={handlePrevPage}
              totalPages={totalPages}
            />

            {isReviewOpen && selectedOrder && (
              <ReviewModal
                isOpen={isReviewOpen}
                onClose={() => setIsReviewOpen(false)}
                userId={selectedOrder.userId}
                restaurantId={order.restaurant?._id || order.restaurantId}
                orderId={selectedOrder._id}
                isEdit={selectedOrder.isEdit}
                existingReview={selectedOrder.existingReview}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
