import React from 'react';
import Image from 'next/image';

const StepsSection: React.FC = () => {
  return (
    <section className='w-full h-full flex flex-col items-center gap-16 p-4'>
      <div className='w-full flex flex-col lg:flex-row justify-between items-start gap-8'>
        <div className='w-full lg:w-1/2 flex flex-col gap-12'>
          <div className='flex flex-col gap-12'>
            <h2 className='text-3xl font-bold text-gray-900'>
              How to get started on Jorge
            </h2>
            <p className='text-xl text-gray-700 opacity-70'>
              Follow these simple steps to begin ordering fresh, high-quality
              tomatoes from our smart farm.
            </p>
          </div>
          <div className='relative'>
            <Image
              src='/assets/image.png'
              alt='line design'
              width={576}
              height={645}
              className='relative rounded-lg'
            />
          </div>
        </div>
        <div className='relative'>
          <div className='bg-gray-300 rounded-lg w-full h-96 lg:h-[774px] absolute' />
          <Image
            src='/assets/image (1).png'
            alt='line design'
            width={576}
            height={645}
            className='relative rounded-lg'
          />
        </div>
      </div>
      <div className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-[50px]'>
        {[
          {
            step: 1,
            title: 'Browse Our Selection',
            description:
              'Explore a variety of high-quality tomatoes straight from our farm. Choose the best option for your needs and preferences.',
          },
          {
            step: 2,
            title: 'Select Your Local Market',
            description:
              "Pick a nearby market where you'd like to receive your order. Our efficient delivery system ensures you get the freshest tomatoes.",
          },
          {
            step: 3,
            title: 'Place Your Order',
            description:
              'Add your chosen tomatoes to the cart, proceed to checkout, and choose your payment method. Simple and secure!',
          },
          {
            step: 4,
            title: 'Easy Booking',
            description:
              'Receive your order at your selected market. Freshness and quality guaranteed, straight from the farm to you.',
          },
        ].map((item) => (
          <div key={item.step} className='flex flex-row items-center gap-4 m-4'>
            <div className='relative flex items-center justify-center'>
              <div className='bg-green-600 opacity-10 rounded-full w-10 h-10 absolute' />
              <span className='relative text-green-600 text-lg font-medium'>
                {item.step}
              </span>
            </div>

            <div className='flex flex-col gap-4 ml-8'>
              <h3 className='text-2xl font-medium text-gray-900'>
                {item.title}
              </h3>
              <p className='text-lg text-gray-600'>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StepsSection;
