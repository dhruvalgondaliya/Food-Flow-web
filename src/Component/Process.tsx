import React from "react";
import pro1 from "../assets/icon-1.png";
import pro2 from "../assets/icon-2.png";
import pro3 from "../assets/icon-3.png";
import arrowImg from "../assets/first-arrow.png";
interface Feature {
  id: number;
  icon: any;
  title: string;
  description: string;
}
const Process: React.FC = () => {
  const features: Feature[] = [
    {
      id: 1,
      icon: pro1 ,
      title: "Local Pickup",
      description: "A neque malesuada in tortor eget justo mauris nec dolor.",
    },
    {
      id: 2,
      icon:  pro2 ,
      title: "Live Order Tracking",
      description: "A neque malesuada in tortor eget justo mauris nec dolor.",
    },
    {
      id: 3,
      icon:  pro3 ,
      title: "Fast Delivery",
      description: "A neque malesuada in tortor eget justo mauris nec dolor.",
    },
  ];
  return (
    <section className="w-full py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white">
      
      <div className="container mx-auto px-4">
        
        {/* Mobile Layout */}
        <div className="grid grid-cols-1 gap-12 md:hidden">
        
          {features.map((feature) => (
            <div
              key={feature.id}
              className="flex flex-col items-center text-center"
            >
              
              <div className="mb-6 transform transition-transform duration-300 hover:scale-110">
                
                <img
                  src={feature.icon}
                  alt={feature.title}
                  className="w-20 h-20 object-contain"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed max-w-sm">
                
                {feature.description}
              </p>
            </div>
          ))}
        </div>
        {/* Desktop/Tablet Layout */}
        <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr_auto_1fr] items-start gap-4 lg:gap-8 max-w-6xl mx-auto">
          {" "}
          {/* Feature 1 */}
          <div className="flex flex-col items-center text-center">
            
            <div className="mb-6 transform transition-transform duration-300 hover:scale-110">
              
              <img
                src={features[0].icon}
                alt={features[0].title}
                className="w-20 h-20 lg:w-24 lg:h-24 object-contain"
              />
            </div>
            <h3 className="text-xl lg:text-2xl font-bold text-gray-800 mb-4 whitespace-nowrap">
              
              {features[0].title}
            </h3>
            <p className="text-gray-600 text-sm lg:text-base leading-relaxed max-w-[250px]">
              
              {features[0].description}
            </p>
          </div>
          {/* Arrow 1 */}
          <div className="flex items-center justify-center self-start pt-8">
            
           <img
                src={arrowImg}
                alt="Arrow"
                className="w-24 h-16 lg:w-32 lg:h-20 object-contain"
                />
          </div>
          {/* Feature 2 */}
          <div className="flex flex-col items-center text-center">
            
            <div className="mb-6 transform transition-transform duration-300 hover:scale-110">
            
              <img
                src={features[1].icon}
                alt={features[1].title}
                className="w-20 h-20 lg:w-24 lg:h-24 object-contain"
              />
            </div>
            <h3 className="text-xl lg:text-2xl font-bold text-gray-800 mb-4 whitespace-nowrap">
            
              {features[1].title}
            </h3>
            <p className="text-gray-600 text-sm lg:text-base leading-relaxed max-w-[250px]">
              
              {features[1].description}{" "}
            </p>
          </div>
          {/* Arrow 2 */}
          <div className="flex items-center justify-center self-start pt-8">
            
            <img
            src={arrowImg}
            alt="Arrow"
            className="w-24 h-16 lg:w-32 lg:h-20 object-contain"
            />
          </div>
          {/* Feature 3 */}
          <div className="flex flex-col items-center text-center">
        
            <div className="mb-6 transform transition-transform duration-300 hover:scale-110">
              
              <img
                src={features[2].icon}
                alt={features[2].title}
                className="w-20 h-20 lg:w-24 lg:h-24 object-contain"
              />
            </div>
            <h3 className="text-xl lg:text-2xl font-bold text-gray-800 mb-4 whitespace-nowrap">
            
              {features[2].title}
            </h3>
            <p className="text-gray-600 text-sm lg:text-base leading-relaxed max-w-[250px]">
              {" "}
              {features[2].description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Process;
