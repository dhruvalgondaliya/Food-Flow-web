import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

const BackToTopWaveButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => setIsVisible(window.scrollY > 300);
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
      isVisible && (
      <div className="fixed bottom-[calc(4.75rem+env(safe-area-inset-bottom))] right-4 z-50 xl:bottom-6 xl:right-6">
        <button
          onClick={scrollToTop}
          className="relative w-12 h-12 bg-[var(--color-family)] rounded-full text-white flex items-center justify-center shadow-lg hover:scale-105 transition duration-300"
        >
          <ArrowUp className="w-5 h-5 z-10 text-[var(--color-primary)] hover:text-[var(--color-white)]" />

          {/* Wave / ripple circle */}
          <span className="absolute inset-0 rounded-full bg-[var(--color-family)] opacity-40 animate-wave"></span>
        </button>
      </div>
    )
  );
};

export default BackToTopWaveButton;
