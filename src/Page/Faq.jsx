import { useState } from "react";
import { ChevronDown } from "lucide-react";
import PageBreadcrumb from "../Component/CommanComponent/PageBreadcrumb";

const faqItems = [
  {
    question: "How do I place an order on Food Flow?",
    answer:
      "Login to your account, choose a category, add items to cart, and complete checkout from the cart page.",
  },
  {
    question: "Can I customize menu items?",
    answer:
      "Yes. For items with variants, select the preferred variant before adding the product to cart.",
  },
  {
    question: "How can I apply coupon codes?",
    answer:
      "You can apply available coupon codes during checkout in the cart flow before placing your order.",
  },
  {
    question: "Where can I track my order status?",
    answer:
      "After placing an order, open the order status page to view progress and updates.",
  },
  {
    question: "What should I do if payment fails?",
    answer:
      "If a payment fails, you can try again from the cart payment step. Your cart items remain saved, so you won’t lose your selections.",
  },
  {
    question: "How can I contact support?",
    answer:
      "You can reach us at 6354296164 or email dhruvalgondaliya28@gmail.com for any ordering or account help.",
  },
];

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="py-6">
      <div className="container mx-auto px-4 space-y-6">
        <PageBreadcrumb pageTitle="FAQ" />

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-600 mb-6">
            Common questions about ordering, payment, and delivery on Food Flow.
          </p>

          <div className="space-y-3">
            {faqItems.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={faq.question} className="border border-gray-200 rounded-xl">
                  <button
                    className="w-full px-4 py-3 flex justify-between items-center text-left cursor-pointer"
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  >
                    <span className="font-medium text-gray-800">{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-600 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-gray-600 text-sm leading-6">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Faq;
