import React from 'react';
import Image from 'next/image';

const CategorySection: React.FC = () => {
  return (
    <section className="bg-gray-100 p-8 w-full">
      <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex flex-col bg-white p-4 items-center">
            <Image
              src="/assets/car.png" // Replace with your image path
              alt="Category 1"
              width={150}
              height={150}
              className="mb-4 cursor-pointer"
            />
          </div>
          <div className="flex flex-col bg-white p-4  items-center">
            <Image
              src="/assets/bag.png" // Replace with your image path
              alt="Category 2"
              width={150}
              height={150}
              className="mb-4 cursor-pointer"
            />
          </div>
          <div className="flex flex-col bg-white p-4  items-center">
            <Image
              src="/assets/wifi.png" // Replace with your image path
              alt="Category 3"
              width={150}
              height={150}
              className="mb-4 cursor-pointer"
            />
          </div>
          <div className="flex flex-col bg-white p-4  items-center">
            <Image
              src="/assets/box.png" // Replace with your image path
              alt="Category 4"
              width={150}
              height={150}
              className="mb-4 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
