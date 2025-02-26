import React from 'react';
import Image from 'next/image';

interface Service {
  title: string;
  imageSrc: string;
  description: string;
}

const services: Service[] = [
  {
    title: 'Premium Quality',
    imageSrc: '/assets/image (2).png',
    description:
      'Our tomatoes are cultivated using advanced IoT technology, ensuring each tomato is grown in optimal conditions for flavor and freshness.',
  },
  {
    title: 'Direct from the Farm',
    imageSrc: '/assets/image (3).png',
    description:
      'Skip the middleman and enjoy tomatoes delivered directly from our farm to your doorstep, as fresh as the day they were picked.',
  },
  {
    title: 'Sustainable Practices',
    imageSrc: '/assets/image (4).png',
    description:
      'We prioritize sustainability in our farming practices to ensure that our operations are environmentally friendly.',
  },
  {
    title: 'Variety Selection',
    imageSrc: '/assets/image (5).png',
    description:
      'From Roma to Cherry to Beefsteak, we offer a wide variety of tomatoes to suit all your culinary needs.',
  },
];

const ServiceComponent: React.FC = () => {
  return (
    <section className=' w-full h-full mb-4 m-auto p-4'>
      <div className='w-full max-w-screen-lg text-center flex flex-col items-center'>
        <div className='text-[#212121] text-3xl font-bold'>
          Services we offer for you
        </div>
        <div className='text-[#212121] opacity-70 text-xl mt-4 mb-4'>
          Our commitment to quality means you get the best tomatoes, grown with
          care and delivered with precision.
        </div>
      </div>
      <div className='w-full max-w-screen-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
        {services.map((service, index) => (
          <div key={index} className='flex flex-col items-start'>
            <div className='text-[#212121] text-2xl font-medium mb-2'>
              {service.title}
            </div>
            <Image
              className='w-full h-40 rounded-lg border border-[#E7E9ED]'
              src={service.imageSrc}
              alt={service.title}
              width={100}
              height={100}
            />

            <div className='text-[#757575] opacity-70 text-base mt-4'>
              {service.description}
            </div>
          </div>
        ))}
      </div>

     
    </section>
  );
};

export default ServiceComponent;
