import { useEffect } from "react";
import { X } from "lucide-react";
import UserReview from "../../Page/UserReview";

export default function ReviewModal({
  isOpen,
  onClose,
  userId,
  restaurantId,
  orderId,
  isEdit = false, 
  existingReview = null,
}) {
  // Disable body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg mx-4 bg-white rounded-xl shadow-lg overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>

        <UserReview
          userId={userId}
          restaurantId={restaurantId}
          orderId={orderId}
          isEdit={isEdit}
          existingReview={existingReview}
          onClose={onClose}
          onSubmit={(data) => {
            onClose();
          }}
        />
      </div>
    </div>
  );
}
