import { useState, useEffect } from "react";
import { Star, Send } from "lucide-react";
import axios from "axios";
import { API_URL } from "../Component/Server/Server";
import { useAlert } from "../ContextProvider/AlertContext";
import { authHeader } from "../Component/Utiles/authHeader";

export default function UserReview({
  restaurantId,
  orderId,
  onClose,
  onSubmit,
  isEdit = false,
  existingReview = null,
}) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showAlert } = useAlert();

  useEffect(() => {
    if (isEdit && existingReview) {
      setRating(existingReview.rating);
      setComment(existingReview.comment);
    }
  }, [isEdit, existingReview]);

  const validateForm = () => {
    if (rating < 1 || rating > 5) {
      showAlert("Please select a rating between 1 and 5 stars", "error");
      return false;
    }
    if (!comment.trim()) {
      showAlert("Comment is required", "error");
      return false;
    } else if (comment.trim().length < 10) {
      showAlert("Comment must be at least 10 characters long", "error");
      return false;
    }
    return true;
  };

  // Create / Update Review
  // const handleSubmit = async () => {
  //   if (!validateForm()) return;
  //   setIsSubmitting(true);

    

  //   try {
  //     const userId = localStorage.getItem("userId");
  //     if (!userId) {
  //       showAlert("Please login to submit a review.", "error");
  //       setIsSubmitting(false);
  //       return;
  //     }
  //     if (!restaurantId) {
  //       showAlert("Restaurant not found for review.", "error");
  //       setIsSubmitting(false);
  //       return;
  //     }
  //     let res;

  //     if (isEdit) {
  //       // Update
  //       res = await axios.put(
  //         `${API_URL}review/${userId}/restorunt/${restaurantId}`,
  //         { rating, comment: comment.trim() },
  //         authHeader()
  //       );
  //       showAlert("Review updated successfully!", "success");
  //     } else {
  //       if (!resolvedOrderId) {
  //         showAlert("Order not found for this review.", "error");
  //         setIsSubmitting(false);
  //         return;
  //       }
  //       // Create
  //       res = await axios.post(
  //        `${API_URL}review/create/${userId}/${restaurantId}/${orderId}`,
  //         { rating, comment: comment.trim() },
  //         authHeader()
  //       );
  //       showAlert("Review submitted successfully!", "success");
  //     }

  //     if (onSubmit) onSubmit(res.data);

  //     if (!isEdit) {
  //       setRating(0);
  //       setComment("");
  //     }

  //     if (onClose) {
  //       setTimeout(() => {
  //         onClose();
  //       }, 1500);
  //     }
  //   } catch (error) {
  //     const backendMessage =
  //       error.response?.data?.message ||
  //       "Error submitting review. Please try again.";
  //     showAlert(backendMessage, "error");
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };


  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
  
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        showAlert("Please login to submit a review.", "error");
        setIsSubmitting(false);
        return;
      }
  
      // Extract string ID if restaurantId is an object
      const resolvedRestaurantId =
        typeof restaurantId === "object" ? restaurantId?._id : restaurantId;
  
      if (!resolvedRestaurantId) {
        showAlert("Restaurant not found for review.", "error");
        setIsSubmitting(false);
        return;
      }
  
      let res;
  
      if (isEdit) {
        res = await axios.put(
          `${API_URL}review/${userId}/restorunt/${resolvedRestaurantId}`,
          { rating, comment: comment.trim() },
          authHeader()
        );
        showAlert("Review updated successfully!", "success");
      } else {
        if (!orderId) {
          showAlert("Order not found for this review.", "error");
          setIsSubmitting(false);
          return;
        }
        // Extract orderId string if it's an object too
        const resolvedOrderId =
          typeof orderId === "object" ? orderId?._id : orderId;
  
        res = await axios.post(
          `${API_URL}review/create/${userId}/${resolvedRestaurantId}/${resolvedOrderId}`,
          { rating, comment: comment.trim() },
          authHeader()
        );
        showAlert("Review submitted successfully!", "success");
      }
  
      if (onSubmit) onSubmit(res.data);
  
      if (!isEdit) {
        setRating(0);
        setComment("");
      }
  
      if (onClose) setTimeout(() => onClose(), 1500);
  
    } catch (error) {
      const backendMessage =
        error.response?.data?.message || "Error submitting review. Please try again.";
      showAlert(backendMessage, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white w-full max-w-xl p-6 rounded-lg shadow-lg relative">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {isEdit ? "Edit Your Review" : "Write a Review"}
      </h2>

      {/* Rating Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Rating *
        </label>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className={`p-1 transition-all duration-200 hover:scale-110 ${
                star <= (hoveredRating || rating)
                  ? "text-yellow-400"
                  : "text-gray-300"
              }`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
            >
              <Star
                size={32}
                fill={
                  star <= (hoveredRating || rating) ? "currentColor" : "none"
                }
                className="drop-shadow-sm"
              />
            </button>
          ))}
          <span className="ml-3 text-sm text-gray-600">
            {rating > 0 ? `${rating} out of 5 stars` : "Select a rating"}
          </span>
        </div>
      </div>

      {/* Comment Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Your Review *
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={5}
          className="w-full px-4 py-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors border-gray-300"
          placeholder="Share your experience about this restaurant..."
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-gray-500">
            {comment.length} characters (minimum 10)
          </span>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
          } text-white shadow-md hover:shadow-lg`}
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>{isEdit ? "Updating..." : "Submitting..."}</span>
            </>
          ) : (
            <>
              <Send size={18} />
              <span>{isEdit ? "Update Review" : "Submit Review"}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
