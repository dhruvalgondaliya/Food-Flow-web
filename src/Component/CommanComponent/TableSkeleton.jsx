const TableSkeleton = ({ rows = 5 }) => {
  const SkeletonBar = ({ width, height = "h-3" }) => (
    <div
      className={`${height} ${width} bg-gray-200 rounded animate-pulse`}
    ></div>
  );

  const SkeletonAvatar = () => (
    <div className="flex items-center space-x-3">
      <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
      <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
    </div>
  );

  const SkeletonActions = () => (
    <div className="flex space-x-2">
      <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
      <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
    </div>
  );

  const SkeletonBadge = () => (
    <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
  );

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse bg-white">
        {/* Table Header */}
        <thead className="border-gray-100 dark:border-white/[0.05] text-gray-700">
          <tr className="border-b border-gray-200">
            <th className="px-5 py-4 text-left">
              <SkeletonBar width="w-8" />
            </th>
            <th className="px-5 py-4 text-left">
              <SkeletonBar width="w-24" />
            </th>
            <th className="px-5 py-4 text-left">
              <SkeletonBar width="w-16" />
            </th>
            <th className="px-5 py-4 text-left">
              <SkeletonBar width="w-20" />
            </th>
            <th className="px-5 py-4 text-left">
              <SkeletonBar width="w-14" />
            </th>
            <th className="px-5 py-4 text-left">
              <SkeletonBar width="w-16" />
            </th>
            <th className="px-5 py-4 text-left">
              <SkeletonBar width="w-24" />
            </th>
            <th className="px-5 py-4 text-left">
              <SkeletonBar width="w-14" />
            </th>
            <th className="px-5 py-4 text-left">
              <SkeletonBar width="w-16" />
            </th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-b border-gray-100 hover:bg-gray-50"
            >
              {/* No */}
              <td className="px-5 py-4">
                <SkeletonBar width="w-4" />
              </td>

              {/* Order Number */}
              <td className="px-5 py-4">
                <SkeletonBar width="w-20" />
              </td>

              {/* Date */}
              <td className="px-5 py-4">
                <SkeletonBar width="w-16" />
              </td>

              {/* Customer */}
              <td className="px-5 py-4">
                <SkeletonAvatar />
              </td>

              {/* Items */}
              <td className="px-5 py-4">
                <SkeletonBar width="w-12" />
              </td>

              {/* Amount */}
              <td className="px-5 py-4">
                <SkeletonBar width="w-14" />
              </td>

              {/* Payment Type */}
              <td className="px-5 py-4">
                <SkeletonBar width="w-18" />
              </td>

              {/* Status */}
              <td className="px-5 py-4">
                <SkeletonBadge />
              </td>

              {/* Actions */}
              <td className="px-5 py-4">
                <SkeletonActions />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableSkeleton;
