import axios from "axios";
import { useEffect, useState, Fragment } from "react";
import { API_URL } from "../Server/Server";
import { resolveMediaUrl } from "../Utiles/mediaUrl";
import {
  ProductCardCell,
  ProductCardRow,
} from "../CommanComponent/ProductCardRow";
import ButtonNavigation from "../ButtonNavigation";
import CardLoading from "../CommanComponent/CardLoading";
import { motion } from "framer-motion";
import Card from "../CommonCard/Card";
import { authHeader } from "../Utiles/authHeader";
import { Dialog, Transition } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../ContextProvider/AlertContext";

const FamilyDeals = ({ categories, loading, error, limit = 4 }) => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  useEffect(() => {
    if (categories?.length > 0) {
      setActiveCategory(categories[0]);
    }
  }, [categories]);

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
      console.error(err);
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

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    navigate("/detail-Items", {
      state: {
        selectedCategory: category,
        categories,
        showTabs: true,
      },
    });
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
          <Transition.Child as={Fragment}>
            <div className="fixed inset-0 bg-black/60" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child as={Fragment}>
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
                            ₹{variant.price}
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

  if (error)
    return <div className="text-center text-red-500 py-20">{error}</div>;

  return (
    <div>
      <div className="text-center w-full py-4 bg-white">
          <p className="text-red-500 text-sm font-medium mb-2">
            Choose Your Categories
          </p>
          <h2 className="text-4xl font-bold text-gray-800">Start Order</h2>
        </div>

      <ButtonNavigation
        categories={categories}
        activeId={activeCategory?._id}
        onCategoryClick={handleCategoryClick}
      />
      <div className="bg-white">
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(limit)].map((_, i) => (
              <CardLoading key={i} />
            ))}
          </div>
        ) : activeCategory?.items?.length > 0 ? (
          <>
            <ProductCardRow>
              {activeCategory.items.slice(0, limit).map((item, index) => (
                <ProductCardCell key={item._id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="h-full w-full rounded-lg bg-white"
                  >
                    <Card
                      title={item.name}
                      image={resolveMediaUrl(
                        item.imageUrl ?? item.imageurl ?? item.image
                      )}
                      description={item.description}
                      QuarterPrice={item.price}
                      oldPrice={item?.oldPrice}
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

            {/* Variant Selection Modal */}
            <VariantModal />
          </>
        ) : (
          <div className="text-center text-gray-500 py-10">No items found.</div>
        )}
      </div>
    </div>
    </div>
  );
};

export default FamilyDeals;
