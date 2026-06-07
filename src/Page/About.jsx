import PageBreadcrumb from "../Component/CommanComponent/PageBreadcrumb";
import PizzaImage from "../assets/hero-bg.png";

const About = () => {
  return (
    <div className="py-6">
      <div className="container mx-auto px-4 space-y-6">
        <PageBreadcrumb pageTitle="About" />

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            About Food Flow
          </h1>
          <p className="text-gray-700 leading-7">
            Food Flow is a modern food ordering experience built for speed and
            simplicity. Discover categories, explore your favorite items, add to
            cart, apply coupons, and checkout in a smooth flow — with clear order
            status updates after you place an order.
          </p>
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
              <p className="font-semibold text-gray-900">Support phone</p>
              <p className="text-gray-600">9313759955</p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
              <p className="font-semibold text-gray-900">Support email</p>
              <p className="text-gray-600 break-all">
                chauhanparth6635@gmail.com
              </p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="font-semibold text-lg mb-2">Fresh Menu</h2>
            <p className="text-gray-600 text-sm">
              Dynamic categories and products updated from API.
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="font-semibold text-lg mb-2">Quick Checkout</h2>
            <p className="text-gray-600 text-sm">
              Cart, coupon, and payment flow built for speed.
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="font-semibold text-lg mb-2">Order Tracking</h2>
            <p className="text-gray-600 text-sm">
              Simple order updates so users always know the status.
            </p>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-orange-500 text-xl potlin mb-2">
                Delicious Restaurant
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                About Food Flow
              </h2>
              <p className="text-gray-600 leading-7 mb-6">
                We focus on clean browsing, fast cart actions, and a reliable
                checkout. Whether you’re ordering for yourself or for family,
                Food Flow keeps things simple — choose items, pick variants if
                available, and place your order with confidence.
              </p>
              <button className="bg-gradient-to-r from-orange-400 to-yellow-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition cursor-pointer">
                Explore Menu
              </button>
            </div>

            <div className="flex justify-center">
              <img
                src={PizzaImage}
                alt="Food Flow about section"
                className="w-full max-w-md object-contain drop-shadow-lg"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
