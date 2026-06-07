import { useLocation } from "react-router-dom";
import axios from "axios";
import { useEffect, useState, Fragment } from "react";
import { motion } from "framer-motion";
import ButtonNavigation from "../ButtonNavigation";
import PageBreadcrumb from "../CommanComponent/PageBreadcrumb";
import { Dialog, Transition } from "@headlessui/react";
import Card from "../CommonCard/Card";
import { authHeader } from "../Utiles/authHeader";
import { API_URL } from "../Server/Server";
import { resolveMediaUrl } from "../Utiles/mediaUrl";
import {
  ProductCardCell,
  ProductCardRow,
} from "../CommanComponent/ProductCardRow";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../ContextProvider/AlertContext";
import { formatCurrency } from "../Utiles/Currency";

const FullMenuPage = () => {
  const location = useLocation();
  const { selectedCategory = null, showTabs = true } = location.state || {};
  const [activeCategory, setActiveCategory] = useState(selectedCategory);
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  useEffect(() => {
    if (!activeCategory && location.state?.categories?.length > 0) {
      setActiveCategory(location.state.categories[0]);
    }
  }, [activeCategory, location.state]);

  // Create Cart Api
  const handleAddToCart = async (
    item,
    variantId = null,
    redirectToCart = true
  ) => {
    try {
      if (!authHeader) {
        showAlert("Please log in to add items to cart.", "error");
        return;
      }

      const payload = {
        quantity: 1,
        addOns: [],
        couponCode: "",
      };

      // Only include variantId if it exists
      if (variantId) {
        payload.variantId = variantId;
      }

      await axios.post(
        `${API_URL}cart/createCart/${userId}/menu/${item._id}`,
        payload,
        authHeader()
      );

      showAlert("Added to cart successfully!", "success");

      if (redirectToCart) {
        setTimeout(() => {
          navigate("/cart");
        }, 1000);
      }
    } catch (err) {
      const errMessage = err.response?.data?.message || "Failed to add to cart";
      showAlert(errMessage, "error");
    }
  };

  // Handle the add to cart button click
  const handleAddToCartClick = (item) => {
    // If product has variants, show modal
    if (item.hasVariants && item.variants?.length > 0) {
      setSelectedProduct(item);
      setSelectedVariant(item.variants[0]._id);
      setShowVariantModal(true);
    } else {
      // If no variants, add directly to cart and redirect
      handleAddToCart(item, null, true);
    }
  };

  // Variant Modal Component
  const VariantModal = () => {
    if (!selectedProduct) return null;

    return (
      <Transition appear show={showVariantModal} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setShowVariantModal(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Select Variant for {selectedProduct.name}
                  </Dialog.Title>

                  <div className="mt-4">
                    {selectedProduct.variants?.map((variant) => (
                      <div
                        key={variant._id}
                        className={`p-3 mb-2 border rounded-lg cursor-pointer ${
                          selectedVariant === variant._id
                            ? "border-orange-500 bg-orange-50"
                            : "border-gray-200"
                        }`}
                        onClick={() => setSelectedVariant(variant._id)}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{variant.size}</span>
                          <span className="text-gray-700">
                            {formatCurrency(variant.price)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none"
                      onClick={() => setShowVariantModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 focus:outline-none"
                      onClick={() => {
                        handleAddToCart(selectedProduct, selectedVariant, true);
                        setShowVariantModal(false);
                      }}
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

  return (
    <div>
      {/* Navigation bar */}
      <PageBreadcrumb pageTitle="Category" />

      {showTabs && (
        <ButtonNavigation
          categories={location.state?.categories || []}
          activeId={activeCategory?._id}
          onCategoryClick={setActiveCategory}
        />
      )}

      <h1 className="text-center text-3xl font-bold mt-8 capitalize">
        All {activeCategory?.name || "Category"}
      </h1>

      <div className="container mx-auto px-4 py-8">
        {activeCategory?.items?.length > 0 ? (
          <ProductCardRow>
            {activeCategory.items.map((item, index) => (
              <ProductCardCell key={item._id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="h-full w-full"
                >
                  <Card
                    title={item.name}
                    image={resolveMediaUrl(
                      item.imageUrl ?? item.imageurl ?? item.image
                    )}
                    description={item.description}
                    QuarterPrice={item.RegularPrice || item.price}
                    oldPrice={item.oldPrice}
                    onAddToCart={() => handleAddToCartClick(item)}
                    hasVariants={
                      item.hasVariants && item.variants?.length > 0
                    }
                    variants={item.variants}
                  />
                </motion.div>
              </ProductCardCell>
            ))}
          </ProductCardRow>
        ) : (
          <div className="text-center text-gray-500 py-10">No items found.</div>
        )}

        {/* Variant Selection Modal */}
        <VariantModal />
      </div>
    </div>
  );
};

export default FullMenuPage;
