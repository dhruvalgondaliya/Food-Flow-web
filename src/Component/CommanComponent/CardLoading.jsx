const CardLoading = () => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden w-full max-w-xs animate-pulse">
      {/* Image Skeleton */}
      <div className="w-full h-48 bg-gray-200" />

      {/* Content Skeleton */}
      <div className="p-4 flex flex-col gap-3">
        <div className="h-5 bg-gray-300 rounded w-3/4 mx-auto" />
        <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto" />
        <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto" />
        <div className="h-4 bg-gray-200 rounded w-4/6 mx-auto" />
        <div className="h-5 bg-gray-300 rounded w-1/2 mx-auto mt-4" />
      </div>
    </div>
  );
};

export default CardLoading;
