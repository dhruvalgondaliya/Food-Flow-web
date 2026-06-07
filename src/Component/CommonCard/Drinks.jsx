function Drinks() {
  const drinks = [
    { id: 1, title: "Water", price: "3.00" },
    { id: 2, title: "1.25lt Soft Drink", price: "$6.00" },
    { id: 2, title: "Can of Soft Drink", price: "$3.50" },
  ];

  return (
    <>
      <h1 className="potlin text-center py-4 mt-4 text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--color-family)] capitalize">
        cold drinks
      </h1>
      <div className="w-full flex justify-center py-8">
        <div className="flex flex-wrap justify-center gap-10 pr-6">
          {drinks.map((meal) => (
            <div
              key={meal.id}
              className="drinksCard bg-white shadow-lg rounded-xl px-6 sm:px-8 py-6 sm:py-7 text-center"
            >
              <h3 className="potlin font-bold text-base sm:text-lg text-[var(--color-family)] leading-snug">
                {meal.title}
              </h3>
              <p className="potlin text-lg font-bold mt-2 text-[var(--color-family)]">
                {meal.price}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Drinks;
