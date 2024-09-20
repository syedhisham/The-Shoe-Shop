import React, { useState } from "react";
import { CarouselCustom } from "../components/CarouselCustom";
import Header from "../components/Header";
import MostRatedProducts from "../components/MostRatedProducts";
import Testimonials from "../components/Testimonials";
import BlogSection from "../components/BlogSection";
import { Button, Input } from "@material-tailwind/react";
import Footer from "../components/Footer";

const Home = () => {
  const [searchVisible, setSearchVisible] = useState(false);

  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
  };

  return (
    <div>
      <div className="">
        <Header onSearchClick={toggleSearch} searchVisible={searchVisible} />
      </div>
      <CarouselCustom />
      <div>
        <div>
          <h1 className="text-center text-3xl mt-5 mb-3">What's New</h1>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4 cursor-pointer">
          {/* Image 1 */}
          <div className="flex flex-col justify-center items-center text-center">
            <img
              src="https://1ststep.pk/cdn/shop/files/trevor_white_sneakers_0120360_1_720x.webp?v=1721993468"
              alt="Placeholder 1"
              className="rounded-full w-[8rem] h-[8rem] sm:w-[10rem] sm:h-[10rem] md:w-[12rem] md:h-[12rem] object-cover transition-transform duration-300 hover:scale-105"
            />
            <p className="mt-2 text-sm sm:text-md font-medium">Shoes</p>
          </div>

          {/* Image 2 */}
          <div className="flex flex-col justify-center items-center text-center">
            <img
              src="https://1ststep.pk/cdn/shop/files/4_9d4d1c59-3d0c-4d79-9b10-0a579d486c60_720x.webp?v=1719845724"
              alt="Placeholder 2"
              className="rounded-full w-[8rem] h-[8rem] sm:w-[10rem] sm:h-[10rem] md:w-[12rem] md:h-[12rem] object-cover transition-transform duration-300 hover:scale-105"
            />
            <p className="mt-2 text-sm sm:text-md font-medium">Sandals</p>
          </div>

          {/* Image 3 */}
          <div className="flex flex-col justify-center items-center text-center">
            <img
              src="https://1ststep.pk/cdn/shop/files/1_7b10300b-2f86-48fc-bf47-5c637d91c79e_720x.webp?v=1702707735"
              alt="Placeholder 3"
              className="rounded-full w-[8rem] h-[8rem] sm:w-[10rem] sm:h-[10rem] md:w-[12rem] md:h-[12rem] object-cover transition-transform duration-300 hover:scale-105"
            />
            <p className="mt-2 text-sm sm:text-md font-medium">Pumps</p>
          </div>

          {/* Image 4 */}
          <div className="flex flex-col justify-center items-center text-center">
            <img
              src="https://1ststep.pk/cdn/shop/files/1_ef5f8f9b-c2c7-4c2d-a4b2-4baf31528536_720x.webp?v=1715173799"
              alt="Placeholder 4"
              className="rounded-full w-[8rem] h-[8rem] sm:w-[10rem] sm:h-[10rem] md:w-[12rem] md:h-[12rem] object-cover transition-transform duration-300 hover:scale-105"
            />
            <p className="mt-2 text-sm sm:text-md font-medium">Slipper</p>
          </div>

          {/* Image 5 */}
          <div className="flex flex-col justify-center items-center text-center">
            <img
              src="https://1ststep.pk/cdn/shop/files/1_0d759801-4a28-495c-9b9c-771c04631659_720x.jpg?v=1701321883"
              alt="Placeholder 5"
              className="rounded-full w-[8rem] h-[8rem] sm:w-[10rem] sm:h-[10rem] md:w-[12rem] md:h-[12rem] object-cover transition-transform duration-300 hover:scale-105"
            />
            <p className="mt-2 text-sm sm:text-md font-medium">Sneakers</p>
          </div>
        </div>
      </div>
      <div className="">
        <h1 className="text-center text-3xl mt-5 mb-3">Insta Fusion</h1>
        {/* Video Elements in a Scrollable Row */}
        <div className="overflow-x-scroll hide-scroll-bar p-4 px-5 sm:px-10 md:px-20">
          <div className="flex space-x-4">
            {/* Video 1 */}
            <div className="h-[20rem] w-[12rem] sm:h-[25rem] sm:w-[15rem] md:h-[30rem] md:w-[17rem] flex-shrink-0">
              <video
                src="https://videos.pexels.com/video-files/3512344/3512344-hd_1080_1920_30fps.mp4"
                className="w-full h-full object-cover rounded-xl"
                autoPlay
                muted
                loop
                controls={false}
              ></video>
            </div>
            {/* Video 2 */}
            <div className="h-[20rem] w-[12rem] sm:h-[25rem] sm:w-[15rem] md:h-[30rem] md:w-[17rem] flex-shrink-0">
              <video
                src="https://videos.pexels.com/video-files/7316094/7316094-uhd_1440_2560_25fps.mp4"
                className="w-full h-full object-cover rounded-xl"
                autoPlay
                muted
                loop
                controls={false}
              ></video>
            </div>
            {/* Video 3 */}
            <div className="h-[20rem] w-[12rem] sm:h-[25rem] sm:w-[15rem] md:h-[30rem] md:w-[17rem] flex-shrink-0">
              <video
                src="https://videos.pexels.com/video-files/7872917/7872917-uhd_1440_2732_25fps.mp4"
                className="w-full h-full object-cover rounded-xl"
                autoPlay
                muted
                loop
                controls={false}
              ></video>
            </div>
            {/* Video 4 */}
            <div className="h-[20rem] w-[12rem] sm:h-[25rem] sm:w-[15rem] md:h-[30rem] md:w-[17rem] flex-shrink-0">
              <video
                src="https://videos.pexels.com/video-files/3048876/3048876-uhd_2560_1440_24fps.mp4"
                className="w-full h-full object-cover rounded-xl"
                autoPlay
                muted
                loop
                controls={false}
              ></video>
            </div>
            {/* Video 5 */}
            <div className="h-[20rem] w-[12rem] sm:h-[25rem] sm:w-[15rem] md:h-[30rem] md:w-[17rem] flex-shrink-0">
              <video
                src="https://videos.pexels.com/video-files/4228658/4228658-hd_1920_1080_24fps.mp4"
                className="w-full h-full object-cover rounded-xl"
                autoPlay
                muted
                loop
                controls={false}
              ></video>
            </div>
            {/* Video 6 */}
            <div className="h-[20rem] w-[12rem] sm:h-[25rem] sm:w-[15rem] md:h-[30rem] md:w-[17rem] flex-shrink-0">
              <video
                src="https://videos.pexels.com/video-files/5310858/5310858-uhd_2560_1440_25fps.mp4"
                className="w-full h-full object-cover rounded-xl"
                autoPlay
                muted
                loop
                controls={false}
              ></video>
            </div>
            {/* Video 7 */}
            <div className="h-[20rem] w-[12rem] sm:h-[25rem] sm:w-[15rem] md:h-[30rem] md:w-[17rem] flex-shrink-0">
              <video
                src="https://videos.pexels.com/video-files/4721750/4721750-uhd_2732_1440_25fps.mp4"
                className="w-full h-full object-cover rounded-xl"
                autoPlay
                muted
                loop
                controls={false}
              ></video>
            </div>
            {/* Video 8 */}
            <div className="h-[20rem] w-[12rem] sm:h-[25rem] sm:w-[15rem] md:h-[30rem] md:w-[17rem] flex-shrink-0">
              <video
                src="https://videos.pexels.com/video-files/4858900/4858900-uhd_2732_1440_25fps.mp4"
                className="w-full h-full object-cover rounded-xl"
                autoPlay
                muted
                loop
                controls={false}
              ></video>
            </div>
            <div className="h-[20rem] w-[12rem] sm:h-[25rem] sm:w-[15rem] md:h-[30rem] md:w-[17rem] flex-shrink-0">
              <video
                src="https://videos.pexels.com/video-files/7876919/7876919-uhd_1440_2732_25fps.mp4"
                className="w-full h-full object-cover rounded-xl"
                autoPlay
                muted
                loop
                controls={false}
              ></video>
            </div>
          </div>
        </div>
      </div>
      <div className="">
        <h1 className="text-center text-3xl mt-5 mb-3">Best Sellers</h1>
        <div className="">
          <MostRatedProducts />
        </div>

        <div className="relative w-full h-[50vh] flex items-center justify-center overflow-hidden mb-20">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')",
            }}
          >
            <div className="w-full h-full bg-black opacity-40"></div>
          </div>

          {/* Text Content */}
          <h1 className="relative text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold leading-tight px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 text-white drop-shadow-lg">
            Contemporary Fashion, Weekly Updates. Premium Quality and Timely
            Dispatch
          </h1>
        </div>

        <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row items-center justify-center gap-8">
          {/* Image Container */}
          <div className="flex-shrink-0 w-full lg:w-1/3">
            <img
              src="https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Descriptive image"
              className="w-full h-auto rounded-lg shadow-md object-cover"
            />
          </div>
          {/* Text Content */}
          <div className="flex-1 w-full lg:w-2/3">
            <p className="text-base md:text-lg lg:text-xl xl:text-2xl font-light text-gray-700 leading-relaxed">
              <span className="font-semibold">
                Discover Timeless Elegance and Modern Comfort.
              </span>{" "}
              Explore our curated collection of premium fashion essentials
              designed to offer exceptional style and unparalleled quality. Each
              piece is crafted with meticulous attention to detail and delivered
              with prompt service, ensuring that you experience both
              sophistication and convenience in every purchase.
            </p>
          </div>
        </div>

        <div className="">
          <Testimonials />
        </div>
        <div className="">
          <BlogSection />
        </div>
        <section className="py-20 mx-auto container px-8 bg-gray-900 rounded-2xl mb-20">
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 !items-center">
            <p className="text-white !font-semibold">
              Stay in the Know: Subscribe for Exclusive Updates
              <span className="lg:inline-block font-thin">
                Get first access to exclusive offers, product launches, and
                expert tips. Stay informed and ahead—subscribe now for updates
                tailored just for you!
              </span>
            </p>
            <div
              className="flex items-start flex-col gap-4 md:flex-row"
            >
              <Input
                color="white"
                label="Enter your email"
                className="text-white border-white"
              />
              <Button className="flex-shrink-0 md:w-fit w-full bg-white text-black">
                subscribe
              </Button>
            </div>
          </div>
        </section>
        <div className="">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Home;
