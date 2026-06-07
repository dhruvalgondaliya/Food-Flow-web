import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { formatCurrency } from "../Utiles/Currency";
const Card = ({
  title,
  description,
  QuarterPrice,
  image,
  onAddToCart,
  hasVariants,
  oldPrice,
  variants,
}) => {
  const handleClick = () => {
    if (onAddToCart) {
      onAddToCart();
    }
  };

  const displayPrice =
    hasVariants && variants?.length > 0 ? variants[0].price : QuarterPrice;

  const [imgBroken, setImgBroken] = useState(false);
  const showImage = Boolean(image) && !imgBroken;

  useEffect(() => {
    setImgBroken(false);
  }, [image]);

  return (
    <div className="group flex h-full w-full max-w-xs flex-col overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:max-w-none">
      <div className="relative overflow-hidden rounded-t-2xl">
        {showImage ? (
          <img
            src={image}
            alt=""
            onError={() => setImgBroken(true)}
            className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-110 sm:h-48"
          />
        ) : (
          <div className="flex h-44 w-full flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-3 text-center sm:h-48">
            <ShoppingBag className="mb-2 h-8 w-8 text-gray-300" aria-hidden />
            <span className="line-clamp-2 text-xs font-medium capitalize text-gray-500">
              {title}
            </span>
          </div>
        )}
        {hasVariants && (
          <span className="absolute top-3 right-3 bg-white/90 text-[#B52929] text-xs font-semibold px-2 py-1 rounded-full shadow-sm">
            Variant
          </span>
        )}
      </div>

      <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between">
        <div className="flex flex-col gap-2 text-left mb-4">
          <h2 className="potlin text-xl sm:text-2xl font-bold text-[#202124] capitalize line-clamp-1">
            {title}
          </h2>

          {/* Description */}
          {description && (
            <p className="text-gray-600 text-sm sm:text-base line-clamp-2">
              {description}
            </p>
          )}
        </div>

        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Price
          </span>
          <div className="flex items-center gap-3">
          {/* old Price */}
          {oldPrice && (
            <p className="font-semibold text-gray-400 line-through text-sm">
              {formatCurrency(oldPrice)}
            </p>
          )}

          {/* Price */}
          {displayPrice && (
            <p className="font-bold text-[#B52929] text-lg">
              {formatCurrency(displayPrice)}
            </p>
          )}
          </div>
        </div>

        <div className="flex items-center justify-center mt-2">
          {/* Add to Cart Button */}
          <button
            onClick={handleClick}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#B52929] to-orange-500 text-white font-semibold hover:opacity-95 transition duration-300 cursor-pointer"
          >
            <ShoppingBag size={18} className="text-white" />
            <span className="font-medium">Add To Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
