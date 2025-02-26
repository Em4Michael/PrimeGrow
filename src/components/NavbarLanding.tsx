'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Logo from '../components/logo';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className='fixed z-30 top-0 left-0 right-0 bg-[#ffffff] p-4 transition-opacity opacity-0.5 duration-300 ease-in-out'>
      <div className='w-[90vw] mx-auto flex flex-col md:flex-row justify-between items-center'>
        <div className='flex justify-between items-center w-full md:w-auto'>
          <div className='text-black text-lg font-bold pb-12'>
            <Logo />
          </div>
          <div className='md:hidden'>
            <button
              onClick={toggleMenu}
              className='text-grey focus:outline-none'
            >
              <svg
                className='w-6 h-6'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M4 6h16M4 12h16M4 18h16'
                ></path>
              </svg>
            </button>
          </div>
        </div>
        <div
          className={`mt-4 md:mt-0 md:flex ${
            isOpen ? 'block' : 'hidden'
          } w-full md:w-auto`}
        >
          <ul className='flex flex-col md:flex-row md:space-x-4 w-full md:w-auto'>
            <li className='m-0.5 text-gray-600 py-2 px-4 hover:bg-[#257009] hover:text-white rounded-md'>
              <Link href='#' className='block text-center'>
                Home
              </Link>
            </li>
            <li className='m-0.5 text-gray-600 py-2 px-4 hover:bg-[#257009] hover:text-white rounded-md'>
              <Link href='#' className='block text-center'>
                Shop
              </Link>
            </li>
            <li className='m-0.5 text-gray-600 py-2 px-4 hover:bg-[#257009] hover:text-white rounded-md'>
              <Link href='#' className='block text-center'>
                About Us
              </Link>
            </li>
            <li className='m-0.5 text-gray-600 py-2 px-4 hover:bg-[#257009] hover:text-white rounded-md'>
              <Link href='#' className='block text-center'>
                Services
              </Link>
            </li>
            <li className='m-0.5 text-gray-600 py-2 px-4 hover:bg-[#257009] hover:text-white rounded-md'>
              <Link href='#' className='block text-center'>
                Contact Us
              </Link>
            </li>
            <li>
              <div className=''>
                <Link href='/login'>
                  <div className="m-0.5 md:w-[124px] w-full hover:bg-[#257009] py-2 px-4 bg-[#e5f4e6] rounded-3xl border border-[#257009] justify-center items-center inline-flex text-[#257009] text-lg font-bold font-['DM Sans'] leading-7 tracking-tight hover:text-white cursor-pointer">
                    Login
                  </div>
                </Link>
              </div>
            </li>
            <li>
              <div className=''>
                <Link href='/signup'>
                  <div className="m-0.5 md:w-[124px] w-full hover:bg-green-700 py-2 px-4 bg-[#257009] rounded-xl justify-center items-center gap-2.5 inline-flex text-white text-lg font-bold font-['DM Sans'] leading-7 tracking-tight">
                    Sign up
                  </div>
                </Link>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
