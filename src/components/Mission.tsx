import React from 'react';
import Image from 'next/image';

const Mission: React.FC = () => {
  return (
    <div className="relative w-full h-full bg-[#EFF3F0] p-8">
      {/* Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Image Section */}
        <div className="relative flex justify-center md:justify-start">
          {/* Blob Image Positioned at the Back */}
          <Image
            src="/assets/blob.png" // Replace with your blob image path
            alt="Background Blob"
            width={300}
            height={300}
            className="absolute -top-8 -left-5 md:-top-0 md:-left-10"
          />

          {/* Foreground Image */}
          <Image
            src="/assets/image 50.png" // Replace with your image path
            alt="Category 1"
            width={450}
            height={450}
            className="relative z-10 mb-4 cursor-pointer"
          />
        </div>

        {/* Mission Content */}
        <div className="flex flex-col justify-start items-start gap-6">
          <h2 className="text-[#257009] text-3xl font-bold font-['DM Sans'] leading-[44px] tracking-[0.18px] break-words">
            Our Mission
          </h2>
          <p className="text-[#212121] text-lg font-normal font-['Inter'] leading-[28px] tracking-[0.09px] break-words">
            At Prime Grow, we're dedicated to bringing you the freshest tomatoes straight from our farm. Our goal is simple: to connect local communities with high-quality produce, ensuring that every tomato you receive is as fresh as if you picked it yourself.
          </p>
          <button className="flex justify-center items-center gap-2 px-4 py-2 border border-[#257009] rounded-[12px] bg-white hover:bg-[#EFF3F0]">
            <span className="text-[#257009] text-lg font-bold font-['DM Sans'] leading-[28px] tracking-[0.09px]">
              Learn More
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Mission;
