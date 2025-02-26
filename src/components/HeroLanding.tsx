import Image from 'next/image';
import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative mt-20 bg-white py-12 px-6 lg:px-20 flex flex-col items-center lg:flex-row">
      <div className="relative max-w-7xl mx-auto flex flex-col lg:flex-row items-center w-full">
        {/* Text Section */}
        <div className="lg:w-1/2 space-y-8 text-center lg:text-left z-10">
          <h1 className="text-[32px] lg:text-[40px] font-bold text-[#257009]">
            Get Fresh Tomatoes, Delivered to Your Doorstep
          </h1>
          <p className="text-[20px] lg:text-[24px] text-[#257009]">
            Order the freshest tomatoes in bulk, straight from our farm.
          </p>
          <div className="flex space-x-4 justify-center lg:justify-start mt-4">
            <button className="py-3 px-6 bg-[#257009] text-white rounded-lg hover:bg-green-700">
              Shop Now
            </button>
            <button className="py-3 px-6 bg-transparent border border-green-600 text-[#257009] rounded-lg hover:bg-green-100">
              Learn More
            </button>
          </div>
        </div>

        {/* Image Section */}
        <div className="lg:w-1/2 flex justify-center mt-8 lg:mt-0 relative">
          <div className="relative w-full max-w-[727px] aspect-[727/480]">
            {/* Ellipse Background */}
            <Image
              src="/assets/Ellipse 16.png"
              alt="Ellipse design"
              width={727}
              height={480}
              className="w-full h-full object-contain z-0"
            />
            {/* Line Design */}
            <Image
              src="/assets/line design.png"
              alt="Line design"
              width={727}
              height={480}
              className="absolute top-0 left-0 w-full h-auto transform -translate-y-[35px] z-20"
            />
            {/* Tomato Image */}
            <Image
              src="/assets/image 1.png"
              alt="Tomatoes"
              width={727}
              height={480}
              className="absolute top-1/2 left-1/2 w-3/4 h-auto transform -translate-x-1/2 -translate-y-1/2 z-10"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;