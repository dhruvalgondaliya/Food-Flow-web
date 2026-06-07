import { getCategoryImageUrl } from "./Utiles/mediaUrl";

const ButtonNavigation = ({ categories, activeId, onCategoryClick }) => {
  return (
    <div className="w-full py-4 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}

        {/* Categories Grid */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {categories?.map(
            (item) =>
              item && (
                <button
                  key={item._id}
                  onClick={() => onCategoryClick(item)}
                  className={`group flex flex-col items-center justify-center 
            w-32 h-32 md:w-36 md:h-36 rounded-4xl cursor-pointer 
            transition-all duration-300 bg-white
            hover:bg-[#F9F7F2]
            ${
              activeId === item._id
                ? "border-[3px] border-[#A92624] shadow-lg"
                : "border-2 border-gray-200 hover:border-[#A92624] hover:shadow-md"
            }`}
                >
                  {/* Icon Wrapper */}
                  {(() => {
                    const src = getCategoryImageUrl(item);
                    return src ? (
                      <div
                        className="mb-3 p-3 rounded-2xl 
                bg-transparent transition-all duration-300
                group-hover:bg-white"
                      >
                        <img
                          src={src}
                          alt=""
                          className="w-14 h-14 md:w-14 md:h-14 object-cover rounded-xl"
                          loading="lazy"
                        />
                      </div>
                    ) : null;
                  })()}

                  {/* Category Name */}
                  <span
                    className={`text-base md:text-md font-semibold capitalize transition-colors duration-300
              ${
                activeId === item._id
                  ? "text-gray-800"
                  : "text-gray-700 group-hover:text-[#A92624]"
              }`}
                  >
                    {item.name}
                  </span>
                </button>
              ),
          )}
        </div>
      </div>
    </div>
  );
};

export default ButtonNavigation;
