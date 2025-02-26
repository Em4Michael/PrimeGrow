// pages/product/page.tsx

import ProductOfferings from '@/components/ProductOfferings';
import ProductDetails from '@/components/ProductDetails';
import Trends from '@/components/Trends';

const Product: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-white px-4 mt-[80px]">
      <ProductDetails />
      
      {/* Add the responsive text sections */}
      <div className='text-center mt-8'>
        <h1 className='text-2xl font-bold text-gray-800 pb-10'>
          You may also like
        </h1>
      </div>
     
      <div className="w-full text-center text-[#757575] text-lg md:text-2xl font-normal leading-normal md:leading-[32px] tracking-[0.12px] mt-4 md:mt-6 mb-5">
        Customers who bought this item also bought
      </div>
      
      <ProductOfferings />
      <Trends />
    </div>
  );
};

export default Product;
