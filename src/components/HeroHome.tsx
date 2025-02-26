import Image from 'next/image';
import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className='relative bg-white flex flex-col items-center lg:flex-row overflow-hidden'>
      <div className='relative max-w-7xl m-0 flex flex-col lg:flex-row items-center z-10'>
        {/* Text Section */}
        <div className='lg:w-1/3 space-y-8 text-center lg:text-left md:translate-x-[18%] translate-y-0 mt-[80px]'>
          <h1 className='text-[32px] lg:text-[40px] font-bold text-[#257009]'>
            Fresh Farm Tomatoes
          </h1>
          <p className='text-md lg:text-lg text-[20px] lg:text-[24px] text-[#257009]'>
            Experience the taste of Prime Grow farm-fresh tomatoes, carefully handpicked and delivered to your doorstep.
          </p>
          <div className='flex space-x-4 justify-center lg:justify-start mt-4'>
            <button className='py-3 px-6 bg-[#257009] text-white rounded-lg hover:bg-green-700'>
              Shop Now
            </button>
          </div>
        </div>

        {/* Ellipse Section */}
        <div className='lg:w-3/4 flex justify-center mt-8 lg:mt-0 relative mb-[100px]'>
          <div className='relative z-20 w-full h-full'>
            <Image
              src='/assets/Ellipse 1.png'
              alt='Ellipse design'
              width={727}
              height={480}
              className='absolute w-full h-full top-0 right-0 transform translate-x-[25%] translate-y-0 -z-10'
            />
            <Image
              src='/assets/line design.png'
              alt='Line design'
              width={727}
              height={480}
              className='h-auto transform translate-x-0 -translate-y-[35px] rounded-xl z-20'
            />
            <Image
              src='/assets/image 47.png'
              alt='Tomatoes'
              width={400}
              height={250}
              className='absolute top-1/2 left-1/2 transform -translate-x-[50%] -translate-y-[35%] z-10'
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
