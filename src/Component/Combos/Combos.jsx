import { motion } from "framer-motion";
import MealGrid from "../CommonCard/MealCombos";
import Card from "../CommonCard/Card";
import Combo1 from "../../assets/Combo1.png";
import Combo2 from "../../assets/Combo2.png";
import Combo3 from "../../assets/Combo3.png";
import Combo4 from "../../assets/Combo4.png";

function Combos() {
  const Combos = [
    {
      id: 1,
      description: "Full Rack Lamb Ribs & 2 Sml Sides",
      oldPrice: "Regular($38.99)",
      price: "$38.99",
      image: Combo1,
    },
    {
      id: 2,
      description: "1/4 Chicken & 2 Sml Sides",
      oldPrice: "Regular($17.99)",
      price: "$17.99",
      image: Combo2,
    },
    {
      id: 3,
      description: "1/2 Chicken & 2 Sml Sides",
      oldPrice: "Regular($24.99)",
      price: "$24.99",
      image: Combo3,
    },
    {
      id: 4,
      description: "1/4 Chicken with chips and can of drink",
      oldPrice: "Regular($15.99)",
      price: "$15.99",
      image: Combo4,
    },
  ];

  return (        
    <>
      <h1 className="potlin text-center py-4 mt-4py-5 mb-2 text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--color-p)] capitalize">
        Combos
      </h1>

      <MealGrid />

      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8 justify-items-center">
          {Combos.map((combo, index) => (
            <motion.div
              key={combo.id}
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 80,
                damping: 12,
                delay: index * 0.2,
              }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <Card
                image={combo.image}
                description={combo.description}
                oldPrice={combo.oldPrice}
                price={combo.price}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Combos;
