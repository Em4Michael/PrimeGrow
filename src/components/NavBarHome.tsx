'use client';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faUser } from '@fortawesome/free-regular-svg-icons';
import { FiShoppingCart } from 'react-icons/fi';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Logo from '../components/logo';
import { useRouter } from 'next/navigation';
import { useAuth } from '../app/context/AuthContext'; // Import AuthContext

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [initials, setInitials] = useState<string | null>(null);
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (user) {
      setInitials(getInitials(user.name)); // Set initials if user is available
    }
  }, [user]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0].toUpperCase())
      .join('');
  };

  return (
    <nav
      className={`fixed z-30 top-0 left-0 right-0 p-4 transition-opacity duration-300 ease-in-out ${
        isScrolled ? 'bg-white shadow-md' : 'bg-white md:bg-transparent'
      }`}
    >
      <div className='w-[90vw] mx-auto flex flex-col md:flex-row justify-between items-center'>
        <div className='flex justify-between items-center w-full md:w-auto'>
          <div className='flex items-center pb-12'>
            <Logo />
          </div>
          <div className='md:hidden'>
            <button
              onClick={toggleMenu}
              className='text-gray-600 focus:outline-none'
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
          className={`mt-4 w-full md:mt-0 md:flex flex-1 justify-between items-center ${
            isOpen ? 'block' : 'hidden'
          }`}
        >
          <div className='flex-1 md:flex md:justify-center'>
            <div className='md:w-[400px] w-full hover:bg-gray-100 py-0 px-4 bg-[#F5F6F6] rounded-3xl flex items-center'>
              <input
                type='text'
                placeholder='Search for tomatoes here'
                className='w-full bg-transparent text-gray-400 text-base font-normal focus:outline-none'
              />
              <div className='w-12 h-12 flex items-center justify-center rounded-full'>
                <FontAwesomeIcon icon={faSearch} className='text-gray-400' />
              </div>
            </div>
          </div>

          <ul className='flex flex-col md:flex-row md:space-x-4 w-full md:w-auto'>
            <li className='m-0.5 text-gray-600 py-2 px-4 hover:bg-[#257009] hover:text-white rounded-md'>
              <a href='#' className='block text-center'>
                Home
              </a>
            </li>
            <li className='m-0.5 text-gray-600 py-2 px-4 hover:bg-[#257009] hover:text-white rounded-md'>
              <a href='#' className='block text-center'>
                About Us
              </a>
            </li>
            <li className='m-0.5 text-gray-600 py-2 px-4 hover:bg-[#257009] hover:text-white rounded-md'>
              <a href='#' className='block text-center'>
                Shop
              </a>
            </li>
            <li className='m-0.5 text-gray-600 py-2 px-4 hover:bg-[#257009] hover:text-white rounded-md'>
              <a href='#' className='block text-center'>
                Contact Us
              </a>
            </li>
          </ul>

          <div className='flex space-x-4 mt-4 ml-4 md:mt-0 justify-between md:justify-center'>
            <button className='text-gray-600 hover:text-red-600 focus:outline-none'>
              <FontAwesomeIcon icon={faHeart} className='w-6 h-6' />
            </button>
            <button
              className='text-gray-600 hover:text-blue-600 focus:outline-none'
              onClick={() => router.push('/profile')} // Navigate to login page
            >
              <FontAwesomeIcon icon={faUser} className='w-6 h-6' />
            </button>
            <button
              className='text-gray-600 hover:text-green-600 focus:outline-none'
              onClick={() => router.push('/cart')}
            >
              <FiShoppingCart className='w-6 h-6' />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
