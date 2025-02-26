// pages/index.tsx
import CategorySection from './CategorySection'
import TestimonialsSection from './TestimonialsSection'
import ProductOfferings from './ProductOfferings'
import Mission from './Mission'
import Learn from './Learn'

const Home: React.FC = () => {
  return (
    <div className="w-full">
      
      <CategorySection />
      <div className='text-center mt-8 bg-[#EFF3F0]'>
        <h1 className='text-2xl font-bold text-gray-800 pb-10 pt-10'>
          Product Offerings
        </h1>
      </div>
      <ProductOfferings /> 
      <Mission />
      <Learn />
      <TestimonialsSection />
    
    </div>
  );
};

export default Home;
