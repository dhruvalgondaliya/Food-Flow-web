import MealCard from "./MealCard ";

const meals = [
  { id: 1, title: "1/2 Chicken with chips and can of drink", price: "19.99" },
  { id: 2, title: "1 Whole Chicken & 2 Sml Sides", price: "32.99" },
  { id: 3, title: "1/4 Lamb Ribs & 2 Sml Sides", price: "20.99" },
  { id: 4, title: "1/2 Lamb Ribs & 2 Sml Sides", price: "29.99" },
];

const MealCombos = () => {
  return (
    <div className="w-full flex justify-center py-8">
      <div className="flex flex-wrap justify-center gap-6  pr-6">
        {meals.map((meal) => (
          <MealCard key={meal.id} title={meal.title} price={meal.price} />
        ))}
      </div>  
    </div>
  );
};

export default MealCombos;
