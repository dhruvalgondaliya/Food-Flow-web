import { useState } from "react";

export default function Tooltip({ children, text, position = "top" }) {
  const [show, setShow] = useState(false);

  const positionClasses = {
    top: "bottom-full mb-2 left-1/2 -translate-x-1/2",
    bottom: "top-full mt-2 left-1/2 -translate-x-1/2",
    left: "right-full mr-2 top-1/2 -translate-y-1/2",
    right: "left-full ml-2 top-1/2 -translate-y-1/2",
  };

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}

      {show && (
        <div
          className={`absolute whitespace-nowrap bg-gray-800 text-white text-sm px-3 py-1 rounded-md shadow-lg z-50 ${positionClasses[position]}`}
        >
          {text}
        </div>
      )}
    </div>
  );
}
