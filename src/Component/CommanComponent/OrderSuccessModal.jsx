import { useEffect } from "react";
import AnimatedImge from "../../assets/success.gif";
import { useNavigate } from "react-router-dom";

const OrderSuccessModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
        navigate("/order-Status");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose, navigate]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 flex flex-col items-center shadow-lg">
        <img src={AnimatedImge} alt="Order Success" className="mx-auto w-40" />
        <h2 className="text-lg font-semibold text-green-600 mt-4">
          Order Placed Successfully!
        </h2>
      </div>
    </div>
  );
};

export default OrderSuccessModal;
