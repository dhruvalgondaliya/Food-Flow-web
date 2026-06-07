export const CouponCard = ({ coupon, onApply, variant = "default" }) => {
  const getDiscountDisplay = () => {
    if (coupon.discountType === "percentage") {
      return `${coupon.discountValue}% OFF`;
    } else if (
      coupon.discountType === "flat" ||
      coupon.discountType === "fixed"
    ) {
      return `₹${coupon.discountValue} OFF`;
    }
    return `${coupon.discountValue} OFF`;
  };

  const getBadgeColor = () => {
    if (coupon.discountType === "percentage") {
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    }
    return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
  };

  if (variant === "embedded") {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50/90 p-3 sm:p-4 hover:border-[#B52929]/40 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <code className="rounded-md bg-gray-900 px-2.5 py-1 font-mono text-sm font-bold tracking-wide text-white">
                {coupon.code}
              </code>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-semibold ${getBadgeColor()}`}
              >
                {getDiscountDisplay()}
              </span>
            </div>
            <p className="mt-2 text-xs text-gray-600">
              Expires{" "}
              {coupon.expiryDate
                ? new Date(coupon.expiryDate).toLocaleDateString()
                : "—"}
            </p>
            {coupon.minOrderAmount ? (
              <p className="text-xs text-gray-500">
                Min. order ₹{coupon.minOrderAmount}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => onApply(coupon)}
            className="shrink-0 rounded-lg bg-[#B52929] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#9f2323] cursor-pointer"
          >
            Apply
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-50 to-red-50 dark:from-gray-700 dark:to-gray-600 border-2 border-dashed border-orange-300 dark:border-orange-500 rounded-xl p-4 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
        <div className="absolute -left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white dark:bg-gray-800 rounded-full border-2 border-orange-300 dark:border-orange-500"></div>
        <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white dark:bg-gray-800 rounded-full border-2 border-orange-300 dark:border-orange-500"></div>

        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <code className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-3 py-1 rounded-md font-mono font-bold text-lg tracking-wider">
                {coupon.code}
              </code>
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${getBadgeColor()}`}
              >
                {getDiscountDisplay()}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <span className="text-gray-600 px-3 text-sm py-1 text-lg tracking-wider">
                  Expiry Date:{" "}
                  {coupon.expiryDate
                    ? new Date(coupon.expiryDate).toLocaleDateString()
                    : "—"}
                </span>
              </div>

              {coupon.minOrderAmount && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                  <span>Min. order: ₹{coupon.minOrderAmount}</span>
                </div>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => onApply(coupon)}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 whitespace-nowrap cursor-pointer"
          >
            Apply Now
          </button>
        </div>

        <div className="absolute top-2 right-2 text-orange-300 dark:text-orange-400 opacity-20">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9.64,7.64C9.87,7.14 10.4,6.8 11,6.8C11.6,6.8 12.13,7.14 12.36,7.64L15.64,14.36C15.87,14.86 15.6,15.4 15,15.4C14.4,15.4 13.87,15.14 13.64,14.64L12.36,12H11.64L10.36,14.64C10.13,15.14 9.6,15.4 9,15.4C8.4,15.4 8.13,14.86 8.36,14.36L9.64,7.64Z" />
          </svg>
        </div>
      </div>
    </>
  );
};
