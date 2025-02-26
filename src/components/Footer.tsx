import { FunctionComponent } from 'react';
import Image from 'next/image'; // Importing the Image component for optimized image rendering

const Footer: FunctionComponent = () => {
  return (
    <div className='relative bg-[#336C36] p-8 sm:p-16 md:p-24 lg:p-40 pb-8'>
      <div className='relative z-10 grid gap-8 lg:grid-cols-6 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 max-w-6xl mx-auto'>
        {/* Description Section */}
        <div className='lg:col-span-2'>
          <div className='flex items-center mb-10'>
            <Image
              className='mx-1 mr-4'
              alt='Logo Image'
              src='/assets/logo3.jpg'
              width={60}
              height={60}
            />
            <b className='text-lg font-bold text-white font-inter'>
              Prime Grow
            </b>
          </div>
          {/* Responsive Width Adjustment */}
          <div className='w-full max-w-[400px] text-white opacity-70 text-base leading-relaxed break-words mb-10'>
            Jorge is a farm management platform that connects local consumers
            with fresh, sustainably grown tomatoes directly from the farm. We
            simplify your access to high-quality produce while supporting local
            agriculture.
          </div>
          <div className='flex space-x-4 mt-10'>
            <Image
              className='h-6 w-6'
              alt='Twitter'
              src='/assets/twitter.svg'
              width={24}
              height={24}
            />
            <Image
              className='h-6 w-6'
              alt='Facebook'
              src='/assets/facebook.svg'
              width={24}
              height={24}
            />
            <Image
              className='h-6 w-6'
              alt='Instagram'
              src='/assets/instagram.svg'
              width={24}
              height={24}
            />
            <Image
              className='h-6 w-6'
              alt='LinkedIn'
              src='/assets/linkedin.svg'
              width={24}
              height={24}
            />
          </div>
        </div>

        {/* Quick Links Section */}
        <div>
          <h4 className='text-lg font-semibold mb-4 text-white font-dm-sans'>
            Quick Links
          </h4>
          <ul className='text-sm space-y-2 text-white font-inter'>
            <li>Home</li>
            <li>About Us</li>
            <li>Products</li>
            <li>How It Works</li>
            <li>Testimonials</li>
            <li>Contact Us</li>
            <li>FAQ</li>
          </ul>
        </div>

        {/* Customer Service Section */}
        <div>
          <h4 className='text-lg font-semibold mb-4 text-white font-dm-sans'>
            Customer Service
          </h4>
          <ul className='text-sm space-y-2 text-white font-inter'>
            <li>Help Center</li>
            <li>Shipping & Delivery</li>
            <li>Returns & Refunds</li>
            <li>Support</li>
          </ul>
        </div>

        {/* Services Section */}
        <div>
          <h4 className='text-lg font-semibold mb-4 text-white font-dm-sans'>
            Services
          </h4>
          <ul className='text-sm space-y-2 text-white font-inter'>
            <li>Premium Quality</li>
            <li>Direct from farm</li>
            <li>Sustainable Practices</li>
            <li>Variety selection</li>
          </ul>
        </div>

        {/* Legal Section */}
        <div>
          <h4 className='text-lg font-semibold mb-4 text-white font-dm-sans'>
            Legal
          </h4>
          <ul className='text-sm space-y-2 text-white font-inter'>
            <li>Privacy Policy</li>
            <li>Terms & Conditions</li>
            <li>Return Policy</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Footer;
