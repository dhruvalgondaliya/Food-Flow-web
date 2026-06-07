import { Link } from "react-router-dom";
import food from "../assets/Food.png";
import Pluse from "../assets/Pluse.png";
import badge from "../assets/badge.png";
import { motion } from "framer-motion";
import { useState } from "react";
import axios from "axios";

function Testing() {
  const [address, setAddress] = useState("42 Mirrabooka Ave, Mirrabooka");
  const [loading, setLoading] = useState(false);

  // Get Location Api
  const handleChangeLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        // Call OpenCage API
        const response = await axios.get(
          `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=7d978895b68b49589d37b2c46b80f024&pretty=1`
        );

        const results = response.data.results;
        if (results.length > 0) {
          const comp = results[0].components;

          // Format address nicely
          const formattedAddress = `${comp.road || comp.suburb || ""}, ${
            comp.city || ""
          }, ${comp.state || ""}${
            comp.postcode ? " - " + comp.postcode : ""
          }, ${comp.country || ""}`;

          setAddress(formattedAddress);
        } else {
          setAddress("Unable to determine your location");
        }
      } finally {
        setLoading(false);
      }
    });
  };

  return (
    <div className="">
      {/* Hero Section */}
      <div className="bg-hero-pattern relative bg-cover bg-center bg-no-repeat  ">
        {/* Main Content */}
        <div className="flex items-center justify-center min-h-screen px-4 lg:py-20 md:py-19 ">
          <div className="max-w-7xl mx-auto w-full">
            <motion.div
              className="text-center mb-8 lg:mb-12"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <motion.p
                className="potlin text-sm sm:text-3xl text-[#F5CA48] lg:text-4xl font-bold mb-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                Order Online - Pickup & Delivery
              </motion.p>

              <motion.h1
                className="text-center mb-6 leading-tight tracking-normal"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <span className="main_header block text-4xl sm:text-5xl md:text-7xl lg:text-9xl font-bold text-white">
                  {/* Pizza Tastes Better Than Skinny Feels */}
                  Pizza Is Pure Happiness
                </span>
                <motion.span
                  className="block sm:mt-6"
                  initial={{ y: -10 }}
                  whileInView={{ y: 0 }}
                  transition={{ type: "spring", stiffness: 100, damping: 10 }}
                >
                  {/* <img
                    src={food}
                    alt="Food"
                    className="mx-auto w-auto h-[50px] sm:h-[60px] md:h-[80px] lg:w-[210px] lg:h-[150px] lg:-mt-16 sm:-mt-10"
                  /> */}
                </motion.span>
              </motion.h1>

              <motion.p
                className="potlin text-md sm:text-lg lg:text-2xl mb-6 font-bold text-[var(--color-white)] max-w-[90%] sm:max-w-2xl mx-auto leading-relaxed text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                Looking for the best food in town? We combine fresh, gourmet
                flavours to create an authentic blend of tastes.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center items-center sm:items-start mx-auto w-full sm:w-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="
                    relative overflow-hidden w-full sm:w-64 max-w-64 lg:w-3xs
                    inter px-6 py-3 text-sm sm:text-base md:text-lg font-bold
                    rounded-full
                    bg-[var(--color-primary)] text-black
                    transition-all duration-300 group
                  "
                >
                  {/* Button Text */}
                  <span className="relative z-20 transition-all duration-300 group-hover:text-black">
                    Order Now
                  </span>

                  {/* Hover Background Fill */}
                  <span
                     className="
                      absolute bottom-0 left-0 w-full h-0
                      bg-white
                      transition-all duration-300
                      group-hover:h-full
                      z-10 rounded-full
                    "
                  />
                </motion.button>
                <span className="inter text-white text-xl sm:pt-2">or</span>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative overflow-hidden w-full lg:w-3xs sm:w-64 max-w-64 inter px-6 py-3 text-sm sm:text-base md:text-lg bg-[var(--color-white)] text-black font-bold rounded-full transition-all z-10 group"
                >
                  <span className="relative z-20 group-hover:text-[var(--color-white)] transition-all duration-300">
                    Save 10% Get Our App!
                  </span>
                  <span className="absolute bottom-0 left-0 w-full h-0 bg-[var(--color-primary-hover)] transition-all duration-300 group-hover:h-full z-10 rounded-full"></span>
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Testing;
