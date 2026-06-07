import { useEffect, useState } from "react";
import { X, AlertTriangle } from "lucide-react";

export default function CancelOrderButton({
  orderId,
  cancelOrder,
  loading,
  success,
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
  }, [open]);

  const handleCancel = () => {
    cancelOrder(orderId);
    setOpen(false);
  };

  return (
    <>
      {/* Cancel Button */}
      <button
        onClick={() => setOpen(true)}
        className="flex w-[150px] bg-gray-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-500 transition-colors justify-center"
      >
        Cancel Order
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-96 p-6 relative">
            {/* Close button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center">
              <AlertTriangle className="w-12 h-12 text-red-500 mb-3" />
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Cancel Order
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Are you sure you want to cancel this order?
              </p>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300"
                >
                  No, Keep Order
                </button>
                <button
                  onClick={handleCancel}
                  disabled={loading || success}
                  className={`flex items-center justify-center w-[150px] px-6 py-3 rounded-xl font-semibold transition-colors
                  ${
                    success
                      ? "bg-green-500 text-white cursor-default"
                      : loading
                      ? "bg-gray-400 text-white"
                      : "bg-gray-500 text-white hover:bg-red-500"
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Cancelling...
                    </>
                  ) : success ? (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Cancelled
                    </>
                  ) : (
                    "Cancel Order"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
