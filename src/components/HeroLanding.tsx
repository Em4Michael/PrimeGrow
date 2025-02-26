import Image from 'next/image';
import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className='relative mt-20 bg-white py-12 px-6 lg:px-20 flex flex-col items-center lg:flex-row overflow-hidden'>
      <div className='relative max-w-7xl mx-auto flex flex-col lg:flex-row items-center z-10'>
        {/* Text Section */}
        <div className='lg:w-1/2 space-y-8 text-center lg:text-left'>
          <h1 className='text-[32px] lg:text-[40px] font-bold text-[#257009]'>
            Get Fresh Tomatoes, Delivered to Your Doorstep
          </h1>
          <p className='text-md lg:text-lg text-[20px] lg:text-[24px] text-[#257009]'>
            Order the freshest tomatoes in bulk, straight from our farm.
          </p>
          <div className='flex space-x-4 justify-center lg:justify-start mt-4'>
            <button className='py-3 px-6 bg-[#257009] text-white rounded-lg hover:bg-green-700'>
              Shop Now
            </button>
            <button className='py-3 px-6 bg-transparent border border-green-600 text-[#257009] rounded-lg hover:bg-green-100'>
              Learn More
            </button>
          </div>
        </div>

        {/* Ellipse Section */}
        <div className='lg:w-1/2 flex justify-center mt-8 lg:mt-0 relative'>
          <div className='relative z-20 w-full h-full'>
          <Image
              src='/assets/Ellipse 16.png'
              alt='line design'
              width={727}
              height={480}
              className='absolute w-full h-full transform translate-x-0 translate-y-0 -z-10'
            />
            
            <Image
              src='/assets/line design.png'
              alt='line design'
              width={727}
              height={480}
              className=' h-auto transform translate-x-0 -translate-y-[35px] rounded-xl z-20'
            />
            <Image
              src='/assets/image 1.png'
              alt='Tomatoes'
              width={727}
              height={480}
              className='absolute top-1/2 left-1/2 transform -translate-x-[50%] -translate-y-[35%] z-10'
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
