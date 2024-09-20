import React, { useEffect } from "react";
import myImage from "../assets/myImage.jpeg";
import MapComponent from "../components/MapComponent";


const teamMembers = [
  {
    name: "Syed Hisham Shah",
    role: "Founder & CEO",
    image: myImage, 
    description:
      "Syed Hisham Shah is an experienced entrepreneur in the ecommerce industry, focusing on providing top-notch footwear solutions. With over 10 years of experience, he has a strong background in retail and digital marketing.",
  },
  {
    name: "Maaz Shinwari",
    role: "Head of Design",
    image: "https://via.placeholder.com/150",
    description:
      "Maaz Shinwari leads the design team with creativity and precision. Her expertise in product design ensures that our footwear not only looks great but also delivers on comfort and durability.",
  },
  {
    name: "Sherjan",
    role: "Marketing Specialist",
    image: "https://via.placeholder.com/150",
    description:
      "Sherjan is a marketing expert with a deep understanding of ecommerce trends. His innovative strategies help us reach a global audience, ensuring customer satisfaction.",
  },
];

const AboutUs = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
  return (
    <section className="px-6 py-4 lg:py-8 text-gray-800">
      <div className="container mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">
            About The Shoe Shop
          </h2>
          <p className="max-w-2xl mx-auto text-sm lg:text-lg">
            At The Shoe Shop, we are dedicated to providing high-quality footwear
            for both men and women. From trendy sneakers to classic pumps, our
            collection is curated to cater to all tastes and needs. We focus on
            comfort, style, and durability to ensure our customers walk with
            confidence.
          </p>
        </div>

        <div className="mb-16">
          <h3 className="text-2xl lg:text-4xl font-semibold mb-8 text-center">
            Meet Our Team
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="bg-white border border-black p-6 rounded-lg text-center"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 mx-auto mb-4 rounded-full object-cover"
                />
                <h4 className="text-xl font-semibold">{member.name}</h4>
                <p className="text-sm text-gray-600">{member.role}</p>
                <p className="mt-4 text-gray-700 text-base">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-16 text-center">
          <h3 className="text-2xl lg:text-4xl font-semibold mb-8">
            Our Core Values
          </h3>
          <p className="max-w-2xl mx-auto text-sm lg:text-lg">
            As a team, we are committed to delivering exceptional service,
            innovation, and sustainability in the footwear industry. Our goal is
            to ensure every customer finds the perfect fit and feels empowered
            by their choices.
          </p>
        </div>

        <div className="mb-16 text-center">
          <h3 className="text-2xl lg:text-4xl font-semibold mb-8">
            Find Us
          </h3>
          <div className="h-96 bg-gray-300 rounded-lg flex items-center justify-center">
            <MapComponent /> 
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
