"use client";

import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Logo: React.FC = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push('/home');
  };

  return (
    <div
      className='fixed top-0 left-0 w-[60] p-4 z-10 flex md:justify-start items-center'
    >
      <div 
        className='flex items-center cursor-pointer'
        onClick={handleClick}
      >
        <Image
          src='/assets/logo2.png'
          alt='logo'
          width={60}
          height={60}
        />
        <h1 className='text-xl font-bold ml-2'>Prime Grow</h1>
      </div>
    </div>
  );
};

export default Logo;
