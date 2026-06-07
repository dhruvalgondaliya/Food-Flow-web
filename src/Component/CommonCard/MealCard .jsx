
const MealCard = ({ title, price }) => {
  return (
    <div className="mealCard bg-white shadow-lg rounded-xl px-6 sm:px-8 py-6 sm:py-7 text-center">
      <h3 className="potlin font-bold text-base sm:text-lg text-[var(--color-family)] leading-snug pt-2">
        {title}
      </h3>
      <p className="potlin text-lg font-bold mt-2 text-[var(--color-family)]">
        ${price}
      </p>
    </div>
  );
};

export default MealCard;
