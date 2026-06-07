import {
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Download,
  MessageSquare,
  Smartphone,
  Star,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import Tooltip from "./ToolTip";
import { formatCurrency } from "../Utiles/Currency";
import TableSkeleton from "./TableSkeleton";

export function PreviousOrdersTable({
  orderData,
  loading,
  handleOpenReview,
  downloadReceipt,
  page,
  setPage,
  limit,
  handleNextPage,
  handlePrevPage,
  totalPages,
}) {
  const [downloadingId, setDownloadingId] = useState(null);

  return (
    <div className="mt-8">
      <h1 className="text-bold text-md mb-2">Previous Orders:</h1>
      <div className="overflow-x-auto overflow-y-visible pb-6">
        <table className="min-w-[850px] w-full text-center text-sm rounded-lg bg-white">
          <thead className="border-gray-100 dark:border-white/[0.05] text-gray-700">
            <tr>
              <th className="px-5 py-4 text-md text-black">No</th>
              <th className="px-5 py-4 text-md text-black">OrderNumber</th>
              <th className="px-5 py-4 text-md text-black">Date</th>
              <th className="px-5 py-4 text-md text-black">Customer</th>
              <th className="px-5 py-4 text-md text-black">Items</th>
              <th className="px-5 py-4 text-md text-black">Amount</th>
              <th className="px-5 py-4 text-md text-black">Payment Type</th>
              <th className="px-5 py-4 text-md text-black">Status</th>
              <th className="px-5 py-4 text-md text-black">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="text-center py-6 text-gray-black">
                  <TableSkeleton />
                </td>
              </tr>
            ) : orderData.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-6 text-black">
                  No previous orders found.
                </td>
              </tr>
            ) : (
              orderData.map((orderItem, index) => (
                <tr
                  key={orderItem._id || index}
                  className="border-t hover:bg-gray-50/10"
                >
                  <td className="px-4 py-3 text-md text-black">
                    {(page - 1) * limit + index + 1}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-md text-black">
                      {orderItem.receipt?.orderId || orderItem._id}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-md text-black">
                      {orderItem?.createdAt
                        ? new Date(orderItem?.createdAt).toLocaleDateString()
                        : "-"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-md text-black">
                      {orderItem.user?.userName ||
                        orderItem.deliveryAddress?.FullName ||
                        "-"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      {orderItem.items?.map((it, i) => (
                        <span
                          key={i}
                          className="font-semibold text-md text-black"
                        >
                          {it.menuItemId?.name} × {it.quantity}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-md text-black text-center">
                      {formatCurrency
                        ? formatCurrency(
                            orderItem?.totalAmount ?? orderItem?.total ?? 0
                          )
                        : orderItem?.totalAmount ?? orderItem?.total ?? 0}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <span className="flex justify-center gap-2 font-semibold text-md text-black">
                      {orderItem?.paymentType === "card" && (
                        <>
                          <CreditCard className="w-5 h-5 text-blue-500" /> Card
                        </>
                      )}
                      {orderItem?.paymentType === "upi" && (
                        <>
                          <Smartphone className="w-5 h-5 text-green-500" /> UPI
                        </>
                      )}
                      {orderItem?.paymentType === "cod" && (
                        <>
                          <Wallet className="w-5 h-5 text-yellow-500" /> Cash
                        </>
                      )}
                      {orderItem?.paymentType === "Razorpay" && (
                        <>
                          <span className="flex items-center gap-1">
                            <img
                              src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg"
                              alt="Razorpay"
                              className="w-5 h-5"
                            />
                            Razorpay
                          </span>
                        </>
                      )}
                      {!orderItem?.paymentType && "-"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        orderItem.orderStatus?.toLowerCase() === "delivered"
                          ? "bg-green-100 text-green-700"
                          : orderItem.orderStatus?.toLowerCase() === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : orderItem.orderStatus?.toLowerCase() === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {orderItem.orderStatus || "-"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-4 relative z-10">
                      {orderItem.orderStatus?.toLowerCase() === "delivered" &&
                        (orderItem.review ? (
                          <Tooltip
                            text="Edit Review"
                            position={index >= orderData.length - 2 ? "top" : "bottom"}
                          >
                            <button
                              onClick={() =>
                                handleOpenReview(
                                  orderItem,
                                  true,
                                  orderItem.review
                                )
                              }
                              className="text-blue-600 hover:text-blue-800 cursor-pointer"
                            >
                              <Star className="w-5 h-5" />
                            </button>
                          </Tooltip>
                        ) : (
                          <Tooltip
                            text="Add Review"
                            position={index >= orderData.length - 2 ? "top" : "bottom"}
                          >
                            <button
                              onClick={() =>
                                handleOpenReview(orderItem, false, null)
                              }
                              className="text-blue-600 hover:text-blue-800 cursor-pointer"
                            >
                              <Star className="w-5 h-5" />
                            </button>
                          </Tooltip>
                        ))}
                      {orderItem.orderStatus?.toLowerCase() === "delivered" && (
                        <button
                          onClick={async () => {
                            setDownloadingId(orderItem._id);
                            await downloadReceipt(orderItem._id);
                            setDownloadingId(null);
                          }}
                          className="text-black hover:text-gray-600 cursor-pointer flex items-center justify-center min-w-[40px]"
                          disabled={downloadingId === orderItem._id}
                        >
                          <Tooltip
                            text="Receipt"
                            position={index >= orderData.length - 2 ? "top" : "bottom"}
                          >
                            {downloadingId === orderItem._id ? (
                              <span className="loader border-2 border-t-2 border-gray-300 border-t-green-500 rounded-full w-5 h-5 animate-spin"></span>
                            ) : (
                              <Download className="w-5 h-5" />
                            )}
                          </Tooltip>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        {(totalPages > 1 || orderData.length >= limit) && (
          <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-4 px-4 py-4 border-t border-gray-200 dark:border-white/[0.1] text-sm text-gray-700">
            <div>
              Page {page} of {totalPages} • Showing {(page - 1) * limit + 1}–
              {Math.min(page * limit, orderData.length)} Orders
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={handlePrevPage}
                disabled={page === 1}
                className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg border transition-colors${
                  page === 1
                    ? "text-gray-400 bg-gray-100 border-gray-200 cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-gray-600"
                    : "text-gray-700 bg-white border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700 cursor-pointer"
                }`}
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx + 1}
                  onClick={() => setPage(idx + 1)}
                  className={`px-3 py-1.5 rounded-md border ${
                    page === idx + 1
                      ? "bg-blue-600 text-white border-blue-600"
                      : "text-gray-700 dark:text-gray-200 border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}

              <button
                onClick={handleNextPage}
                disabled={page === totalPages}
                className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                  page === totalPages
                    ? "text-gray-400 bg-gray-100 border-gray-200 cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-gray-600"
                    : "text-gray-700 bg-white border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700 cursor-pointer"
                }`}
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
      {/* Simple loader style for download button */}
      <style>{`
        .loader {
          border-style: solid;
          border-width: 2px;
          border-radius: 50%;
          border-top-color: #22c55e;
          border-right-color: #d1d5db;
          border-bottom-color: #d1d5db;
          border-left-color: #d1d5db;
          width: 20px;
          height: 20px;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
