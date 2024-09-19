import React from "react";
import { motion } from "framer-motion";

const testimonials = [
  {
    id: 1,
    name: "Ayesha Khan",
    message:
      "Excellent service and high-quality products. Highly recommend to everyone!",
  },
  {
    id: 2,
    name: "Omar Ahmed",
    message:
      "A fantastic shopping experience with timely delivery and great customer support.",
  },
  {
    id: 3,
    name: "Fatima Ali",
    message:
      "The quality of the clothing is top-notch, and the styles are always in vogue.",
  },
  {
    id: 4,
    name: "Ahmed Raza",
    message:
      "A reliable store with a wide range of fashionable items and exceptional service.",
  },
  {
    id: 5,
    name: "Sara Khan",
    message:
      "Always pleased with my purchases. The products exceed expectations every time.",
  },
];

const CustomerTestimonials = () => {
  return (
    <div className="p-4 lg:p-8">
      <h1 className="text-2xl lg:text-4xl font-bold mb-6 text-center">
        Customer Voices: Experiences You Can Trust
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 h-auto lg:h-[22rem]">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.id}
            className="border border-black p-6 lg:p-10 rounded-lg flex flex-col justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <p className="text-gray-800 mb-4 text-sm lg:text-base">
              {testimonial.message}
            </p>
            <span className="text-gray-600 font-semibold text-sm lg:text-base">
              {testimonial.name}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CustomerTestimonials;
