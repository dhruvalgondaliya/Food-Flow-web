export function ProductCardRow({ children }) {
  return (
    <div className="-mx-4 sm:mx-0">
      <div
        className="
          flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-pb-2 scroll-smooth overscroll-x-contain px-4 pb-2 pt-0.5
          touch-pan-x
          no-scrollbar
          sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 sm:pt-0 sm:snap-none
          lg:grid-cols-4
        "
      >
        {children}
      </div>
    </div>
  );
}

export function ProductCardCell({ children }) {
  return (
    <div className="w-[min(88vw,20rem)] shrink-0 snap-start sm:w-full sm:max-w-xs sm:justify-self-center sm:shrink">
      {children}
    </div>
  );
}
