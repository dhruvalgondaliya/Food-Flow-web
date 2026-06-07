import LoaderPizza from "../../assets/loader-pizza.png";

const Loader = ({ label = "Loading...", size = 72 }) => {
  const px = typeof size === "number" ? `${size}px` : size;

  return (
    <div className="w-full flex flex-col items-center justify-center py-10">
      <img
        src={LoaderPizza}
        alt=""
        style={{ width: px, height: px }}
        className="animate-spin-slow drop-shadow-md"
      />
      {label ? (
        <p className="mt-4 text-sm font-semibold text-gray-600">{label}</p>
      ) : null}
    </div>
  );
};

export default Loader;
