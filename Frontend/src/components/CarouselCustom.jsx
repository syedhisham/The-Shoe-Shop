import React, { useState, useEffect } from 'react';

export function CarouselCustom() {
  const images = [
    "https://img.freepik.com/free-photo/collection-colorful-shoes-neatly-lined-up-wooden-shelves_91128-4251.jpg?t=st=1723222215~exp=1723225815~hmac=97b2d8e4bc37ab35319114f02fef424d9b7898130c846b8215dba274524ba413&w=1380",
    "https://img.freepik.com/free-photo/still-life-say-no-fast-fashion_23-2149669600.jpg?t=st=1723222306~exp=1723225906~hmac=91f03cf1debf46a63e56826b54b7660e73db6ca939bc52bdf35d11261ec35b29&w=1060",
    "https://img.freepik.com/free-vector/modern-sale-banner-with-product_1361-1636.jpg?w=1060&t=st=1723222647~exp=1723223247~hmac=cf7dedeb17fc3f731a6581b374b27f31c09cf2291ca7e011b9b3d780f621b491",
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative w-[80vw] h-[79vh] overflow-hidden m-auto">
      {images.map((src, index) => (
        <img
          key={index}
          src={src}
          alt={`Slide ${index + 1}`}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
            activeIndex === index ? 'opacity-100 z-20' : 'opacity-0 z-10'
          }`}
        />
      ))}

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-30">
        {images.map((_, index) => (
          <span
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`block h-1 rounded-2xl cursor-pointer transition-all ${
              activeIndex === index ? "w-8 bg-white" : "w-4 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
