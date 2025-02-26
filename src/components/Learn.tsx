import React from 'react';
import Image from 'next/image';

const LearnMore: React.FC = () => {
  return (
    <div className="relative w-full h-full bg-[#EFF3F0] p-8">
      {/* Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
       

        {/* Learn More Content */}
        <div className="flex flex-col justify-center items-start gap-6 bg-[#92B784] p-8 rounded-md">
          <h2 className="text-white text-3xl font-bold font-['DM Sans'] leading-[44px] tracking-[0.18px] break-words">
            Learn More
          </h2>
          <p className="text-white text-lg font-normal font-['Inter'] leading-[28px] tracking-[0.09px] break-words">
            Discover more about our commitment to sustainable farming practices, ensuring that every tomato is grown with care and respect for nature. We believe in fostering a connection between our farm and your table, bringing you produce that’s not just fresh but also responsibly sourced. Join us in making a difference, one tomato at a time.
          </p>
          <button className="flex justify-center items-center gap-2 px-4 py-2 border border-white rounded-[12px] bg-[#6EA05B] hover:bg-[#1f5a06]">
            <span className="text-white text-lg font-bold font-['DM Sans'] leading-[28px] tracking-[0.09px]">
              Explore Our Story
            </span>
          </button>
        </div>

         {/* Image Section */}
         <div className="flex justify-center ">
          <Image
            src="/assets/image 51.png" // Replace with your image path
            alt="Category 1"
            width={450}
            height={450}
            className="mb-4 cursor-pointer"
          />
        </div>

      </div>
    </div>
  );
};

export default LearnMore;
