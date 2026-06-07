import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronRight,
  Heart,
  Search,
  Tag,
  Ticket,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Testing from "./Testing";
import { useMenu } from "../ContextProvider/MenuContext";
import Process from "../Component/Process";
import Card from "../Component/CommonCard/Card";
import { API_URL } from "../Component/Server/Server";
import { getCategoryImageUrl, resolveMediaUrl } from "../Component/Utiles/mediaUrl";
import { useAlert } from "../ContextProvider/AlertContext";
import { authHeader } from "../Component/Utiles/authHeader";
import { Dialog, Transition } from "@headlessui/react";
import Loader from "../Component/CommanComponent/Loader";
import { fetchCoupons } from "../Component/Api/CartApi";
import { CouponCard } from "../Component/CommanComponent/CouponCard";
import {
  ProductCardCell,
  ProductCardRow,
} from "../Component/CommanComponent/ProductCardRow";

const testimonials = [
  {
    id: 1,
    name: "Dhruval Patel",
    role: "Regular Customer",
    rating: 5,
    review:
      "Food Flow gives me fast delivery and fresh food every time. The category wise menu is very easy to use.",
  },
  {
    id: 2,
    name: "Riya Shah",
    role: "Food Blogger",
    rating: 5,
    review:
      "The UI is clean and ordering is super smooth. I especially like variant selection and quick checkout flow.",
  },
  {
    id: 3,
    name: "Harsh Mehta",
    role: "Verified User",
    rating: 4,
    review:
      "Great item quality and simple order tracking. Support team is responsive and delivery updates are timely.",
  },
];

function Home({ setCartCount }) {
  const navigate = useNavigate();
  const { categories, loading, error } = useMenu();
  const { showAlert } = useAlert();
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [couponLoading, setCouponLoading] = useState(false);
  const [homeCoupons, setHomeCoupons] = useState([]);
  const [homeSearch, setHomeSearch] = useState("");
  const sectionRefs = useRef({});
  const userId = localStorage.getItem("userId");

  const sortedCategories = useMemo(() => {
    if (!categories?.length) return [];
    return [...categories];
  }, [categories]);

  const visibleCategories = useMemo(() => {
    const q = homeSearch.trim().toLowerCase();
    if (!q) return sortedCategories;
    return sortedCategories.filter((c) => {
      if (c.name?.toLowerCase().includes(q)) return true;
      return (c.items || []).some((i) => i.name?.toLowerCase().includes(q));
    });
  }, [sortedCategories, homeSearch]);

  const activeHomeCoupons = useMemo(
    () =>
      (homeCoupons || []).filter(
        (c) => !c.expiryDate || new Date(c.expiryDate) > new Date()
      ),
    [homeCoupons]
  );

  useEffect(() => {
    let ignore = false;
    const loadCoupons = async () => {
      try {
        setCouponLoading(true);
        const res = await fetchCoupons();
        const data = res?.data || res || [];
        if (!ignore) setHomeCoupons(Array.isArray(data) ? data : []);
      } catch (_err) {
        if (!ignore) setHomeCoupons([]);
      } finally {
        if (!ignore) setCouponLoading(false);
      }
    };

    loadCoupons();
    return () => {
      ignore = true;
    };
  }, []);

  const handleViewAll = (category) => {
    navigate("/detail-Items", {
      state: {
        selectedCategory: category,
        categories: sortedCategories,
        showTabs: true,
      },
    });
  };

  const handleScrollToCategory = (categoryId) => {
    sectionRefs.current[categoryId]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleAddToCart = async (item, variantId = null) => {
    try {
      if (!userId || !localStorage.getItem("token")) {
        showAlert("Please login first to add items.", "error");
        navigate("/login");
        return;
      }

      const payload = {
        quantity: 1,
        addOns: [],
        couponCode: "",
      };

      if (variantId) payload.variantId = variantId;

      await axios.post(
        `${API_URL}cart/createCart/${userId}/menu/${item._id}`,
        payload,
        authHeader()
      );

      if (setCartCount) setCartCount((prev) => prev + 1);
      showAlert("Added to cart successfully!", "success");
    } catch (err) {
      const errMessage = err.response?.data?.message || "Failed to add to cart";
      showAlert(errMessage, "error");
    }
  };

  const handleAddToCartClick = (item) => {
    if (item.hasVariants && item.variants?.length > 0) {
      setSelectedProduct(item);
      setSelectedVariant(item.variants[0]._id);
      setShowVariantModal(true);
      return;
    }
    handleAddToCart(item);
  };

  const VariantModal = () => {
    if (!selectedProduct) return null;
    return (
      <Transition appear show={showVariantModal} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setShowVariantModal}>
          <Transition.Child as={Fragment}>
            <div className="fixed inset-0 bg-black/50" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child as={Fragment}>
                <Dialog.Panel className="w-full max-w-md rounded-2xl bg-white p-6 text-left shadow-xl">
                  <Dialog.Title className="text-lg font-semibold">
                    Select Variant for {selectedProduct.name}
                  </Dialog.Title>
                  <div className="mt-4 space-y-2">
                    {selectedProduct.variants?.map((variant) => (
                      <button
                        key={variant._id}
                        onClick={() => setSelectedVariant(variant._id)}
                        className={`w-full text-left border p-3 rounded-lg cursor-pointer ${
                          selectedVariant === variant._id
                            ? "border-[#B52929] bg-red-50"
                            : "border-gray-200"
                        }`}
                      >
                        <div className="flex justify-between">
                          <span>{variant.size}</span>
                          <span>Rs. {variant.price}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      onClick={() => setShowVariantModal(false)}
                      className="px-4 py-2 border rounded-md cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        handleAddToCart(selectedProduct, selectedVariant);
                        setShowVariantModal(false);
                      }}
                      className="px-4 py-2 bg-[#B52929] text-white rounded-md cursor-pointer"
                    >
                      Add to Cart
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    );
  };

  const handleNextTestimonial = () => {
    setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrevTestimonial = () => {
    setTestimonialIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <>
      <Testing />
      <Process />

      <section className="border-b border-stone-200/90 bg-[#faf8f4] px-4 py-4 xl:hidden">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400"
            strokeWidth={2.2}
          />
          <input
            type="search"
            value={homeSearch}
            onChange={(e) => setHomeSearch(e.target.value)}
            placeholder="Search dishes & categories…"
            className="w-full rounded-2xl border border-stone-200/90 bg-white py-3 pl-11 pr-4 text-sm text-stone-800 shadow-sm outline-none ring-0 transition placeholder:text-stone-400 focus:border-[#B52929] focus:ring-2 focus:ring-[#B52929]/20"
            autoComplete="off"
            enterKeyHint="search"
          />
        </div>

        <div className="hidden mt-4 grid grid-cols-4 gap-2">
          {[
            {
              label: "Quick",
              icon: Zap,
              onClick: () =>
                navigate("/detail-Items", {
                  state: { categories: sortedCategories, showTabs: true },
                }),
            },
            {
              label: "Deals",
              icon: Ticket,
              onClick: () =>
                document
                  .getElementById("home-coupons-anchor")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" }),
            },
            {
              label: "Saved",
              icon: Heart,
              onClick: () =>
                navigate(
                  localStorage.getItem("token") ? "/userProfile" : "/login"
                ),
            },
          ].map(({ label, icon: Icon, onClick }) => (
            <button
              key={label}
              type="button"
              onClick={onClick}
              className="flex flex-col items-center gap-1.5 rounded-2xl border border-stone-200/80 bg-white py-3 shadow-sm transition active:scale-[0.97] cursor-pointer"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#B52929]/10 text-[#B52929]">
                <Icon className="h-5 w-5" strokeWidth={2.2} />
              </span>
              <span className="text-[11px] font-bold text-stone-800">
                {label}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-6">
          <h2 className="potlin text-xl font-bold text-stone-900">
            Curated categories
          </h2>
          <p className="mt-0.5 text-xs text-stone-500">Swipe to explore</p>
          <div className="no-scrollbar mt-3 -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 touch-pan-x">
            {sortedCategories.map((category) => {
              const thumb = getCategoryImageUrl(category);
              return (
                <button
                  key={category._id}
                  type="button"
                  onClick={() => handleScrollToCategory(category._id)}
                  className="snap-start shrink-0 flex w-[4.75rem] flex-col items-center gap-2 text-center"
                >
                  <span className="relative h-[4.5rem] w-[4.5rem] overflow-hidden rounded-2xl bg-white shadow-md ring-2 ring-white">
                    {thumb ? (
                      <img
                        src={thumb}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center bg-stone-100 text-lg font-bold text-[#B52929]">
                        {category.name?.[0] ?? "?"}
                      </span>
                    )}
                  </span>
                  <span className="line-clamp-2 w-full text-[10px] font-bold capitalize leading-tight text-stone-800">
                    {category.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="hidden border-y border-gray-100 bg-white py-6 xl:block">
        <div className="container mx-auto px-4">
          <p className="text-center text-red-500 text-sm font-medium">
            Choose Your Categories
          </p>
          <h2 className="text-center text-3xl font-bold mb-6">Start Order</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {sortedCategories.map((category) => (
              <button
                key={category._id}
                onClick={() => handleScrollToCategory(category._id)}
                className="px-4 py-2 rounded-full border border-gray-300 hover:border-[#B52929] hover:text-[#B52929] transition capitalize cursor-pointer"
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {loading && (
        <Loader label="Loading categories..." />
      )}

      {error && <div className="py-8 text-center text-red-500">{error}</div>}

      {!loading &&
        !error &&
        visibleCategories.map((category) => (
          <section
            key={category._id}
            ref={(el) => {
              sectionRefs.current[category._id] = el;
            }}
            className="py-10"
          >
            <div className="container mx-auto px-4">
              <div className="mb-6 flex items-start justify-between gap-3 sm:items-center">
                <h3 className="text-2xl font-bold capitalize leading-tight sm:text-3xl">
                  {category.name}
                </h3>
                <button
                  onClick={() => handleViewAll(category)}
                  className="text-[#B52929] font-semibold hover:underline cursor-pointer"
                >
                  View All
                </button>
              </div>

              {category.items?.length ? (
                <ProductCardRow>
                  {category.items.slice(0, 8).map((item) => (
                    <ProductCardCell key={item._id}>
                      <Card
                        title={item.name}
                        image={resolveMediaUrl(
                          item.imageUrl ??
                            item.imageurl ??
                            item.image
                        )}
                        description={item.description}
                        QuarterPrice={item.RegularPrice || item.price}
                        oldPrice={item.oldPrice}
                        hasVariants={
                          item.hasVariants && item.variants?.length > 0
                        }
                        variants={item.variants}
                        onAddToCart={() => handleAddToCartClick(item)}
                      />
                    </ProductCardCell>
                  ))}
                </ProductCardRow>
              ) : (
                <p className="text-gray-500">No items available in this category.</p>
              )}
            </div>
          </section>
        ))}

      {!loading && !error && homeSearch.trim() && visibleCategories.length === 0 ? (
        <div className="px-4 py-10 text-center text-stone-600 xl:hidden">
          No dishes match &ldquo;{homeSearch.trim()}&rdquo;. Try another search.
        </div>
      ) : null}

      <section id="home-coupons-anchor" className="scroll-mt-4 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#4a1216] via-[#1f0a0c] to-[#0a0505] p-8 text-white shadow-2xl md:p-12 lg:p-14">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <div>
                <span className="inline-block bg-[#B52929] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] sm:text-xs">
                  Best deals. Fresh taste.
                </span>
                <h2 className="mt-5 text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">
                  Ready to order?
                </h2>
                <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/85 sm:text-base">
                  Explore categories, pick your meal, and checkout in seconds —
                  with coupons you can apply on the way to cart.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (!sortedCategories.length) return;
                      navigate("/detail-Items", {
                        state: { categories: sortedCategories, showTabs: true },
                      });
                    }}
                    disabled={!sortedCategories.length}
                    className="inline-flex items-center justify-center rounded-full bg-[#F5CA48] px-7 py-3 text-sm font-bold text-gray-900 shadow-lg transition hover:bg-[#f0c040] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                  >
                    View Menu
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleScrollToCategory(sortedCategories?.[0]?._id)
                    }
                    disabled={!sortedCategories.length}
                    className="inline-flex items-center justify-center rounded-full border-2 border-white/35 bg-transparent px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                  >
                    Browse Categories
                  </button>
                </div>
              </div>

              <div className="relative flex justify-center lg:justify-end">
                <div className="relative w-full max-w-md -rotate-1 sm:rotate-2">
                  <span
                    className="absolute -right-1 -top-1 z-10 h-3 w-3 rounded-full bg-[#B52929] ring-4 ring-white/20"
                    aria-hidden
                  />
                  <div className="rounded-2xl border border-white/10 bg-white p-6 text-gray-900 shadow-2xl sm:p-8">
                    <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-[#B52929]">
                      <Tag className="h-4 w-4 shrink-0" strokeWidth={2.5} />
                      Coupons
                    </div>
                    <h3 className="mt-2 text-xl font-extrabold text-gray-900 sm:text-2xl">
                      Save more on your next order
                    </h3>
                    <p className="mt-2 text-sm text-gray-600">
                      Pick a code and use it at checkout.
                    </p>
                    <div className="mt-5 max-h-[260px] space-y-3 overflow-y-auto pr-1">
                      {couponLoading ? (
                        <Loader label="Loading coupons..." size={56} />
                      ) : activeHomeCoupons.length ? (
                        activeHomeCoupons.slice(0, 4).map((coupon) => (
                          <CouponCard
                            key={coupon._id || coupon.code}
                            coupon={coupon}
                            variant="embedded"
                            onApply={(c) =>
                              showAlert(
                                `Use code ${c.code} at checkout`,
                                "success"
                              )
                            }
                          />
                        ))
                      ) : (
                        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 py-8 text-center text-sm text-gray-500">
                          No coupons right now — check back soon.
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate("/cart")}
                      className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gray-900 py-3.5 text-sm font-bold text-white transition hover:bg-black cursor-pointer"
                    >
                      Go to Cart
                      <ChevronRight className="h-5 w-5" strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#B52929]">
                Testimonials
              </p>
              <h3 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl md:text-5xl">
                Loved by hungry customers
              </h3>
              <p className="mt-3 max-w-2xl text-gray-600">
                Real feedback from people ordering with Food Flow.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handlePrevTestimonial}
                className="h-11 rounded-full border border-gray-300 bg-white px-6 text-sm font-semibold text-gray-900 transition hover:bg-gray-50 cursor-pointer"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={handleNextTestimonial}
                className="h-11 rounded-full bg-[#B52929] px-6 text-sm font-semibold text-white shadow-md transition hover:bg-[#9f2323] cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>

          {(() => {
            const total = testimonials.length;
            const featured = testimonials[testimonialIndex];
            const sideTop = testimonials[(testimonialIndex + 1) % total];
            const sideBottom = testimonials[(testimonialIndex + 2) % total];

            const initials = (name) =>
              name
                .split(" ")
                .filter(Boolean)
                .slice(0, 2)
                .map((p) => p[0]?.toUpperCase())
                .join("");

            const stars = (n) => (
              <span className="text-amber-400">
                {"★".repeat(n)}
                <span className="text-gray-200">{"★".repeat(5 - n)}</span>
              </span>
            );

            const SideCard = ({ t }) => (
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md">
                <p className="text-sm italic leading-relaxed text-gray-600">
                  &ldquo;{t.review}&rdquo;
                </p>
                <div className="mt-5 flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-900 text-sm font-bold text-white">
                      {initials(t.name)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{t.name}</p>
                      <p className="text-xs uppercase tracking-wide text-gray-500">
                        {t.role}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm">{stars(t.rating)}</div>
                </div>
              </div>
            );

            return (
              <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
                <div className="lg:col-span-7">
                  <div className="relative overflow-hidden rounded-2xl border border-gray-100 border-l-[6px] border-l-[#B52929] bg-white p-8 shadow-xl sm:p-10">
                    <p
                      className="pointer-events-none absolute bottom-4 right-6 select-none font-serif text-[7rem] leading-none text-gray-100 sm:text-[9rem]"
                      aria-hidden
                    >
                      &ldquo;
                    </p>
                    <div className="relative flex items-start justify-between gap-4">
                      <span className="rounded-md bg-[#B52929] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                        Featured
                      </span>
                      <span className="text-xs text-gray-400">
                        {testimonialIndex + 1} / {total}
                      </span>
                    </div>
                    <p className="relative mt-6 text-lg font-bold leading-relaxed text-gray-900 sm:text-xl">
                      {featured.review}
                    </p>
                    <div className="relative mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-6">
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#B52929] text-lg font-bold text-white">
                          {initials(featured.name)}
                        </div>
                        <div>
                          <p className="text-lg font-bold text-gray-900">
                            {featured.name}
                          </p>
                          <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                            {featured.role}
                          </p>
                        </div>
                      </div>
                      <div className="text-lg">{stars(featured.rating)}</div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-6 lg:col-span-5">
                  <SideCard t={sideTop} />
                  <SideCard t={sideBottom} />
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      <VariantModal />
    </>
  );
}

export default Home;
