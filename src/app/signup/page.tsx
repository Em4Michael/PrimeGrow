// pages/signup.tsx or app/signup/page.tsx
'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import Logo from '../../components/logo';
import { useAuth } from '../../app/context/AuthContext';
import { useRouter } from 'next/navigation';

const Signup: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeInput, setActiveInput] = useState<string | null>(null);
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { signup } = useAuth();
  const router = useRouter();

  const handlelogin = () => {
    router.push('/login');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleFocus = (inputName: string) => {
    setActiveInput(inputName);
  };

  const handleBlur = () => {
    setActiveInput(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      await signup({ fullName, phoneNumber, password });
    } catch (error: any) {
      setErrorMessage(error.message || 'Error during signup. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = () => {
    // Assuming this redirects to the homepage
    window.location.href = '/';
  };

  return (
    <div className='flex flex-col sm:flex-row w-full min-h-screen bg-white rounded-2xl overflow-hidden'>
      {/* Left side - Form */}
      <div className='flex-1 p-[2rem] sm:p-[2rem] flex flex-col justify-center items-center'>
        {/* Header */}
        <div className='flex items-center fixed w-full bg-white top-0 left-0 p-4'>
          <div
            className='flex items-center cursor-pointer'
            onClick={handleClick}
          >
            <Image src='/assets/logo2.png' alt='logo' width={60} height={60} />
            <h1 className='text-xl font-bold ml-2'>Prime Grow</h1>
          </div>
        </div>

        {/* Welcome Message */}
        <div className='mb-2 mt-[50px]'>
          <div className='text-gray-900 text-[18px] sm:text-3xl font-bold leading-snug'>
            Welcome to Prime Grow Farm
          </div>
          <div className='text-gray-500 text-[14px] sm:text-base mt-2'>
            Effortlessly Order Fresh Tomatoes Direct from Our Farm
          </div>
        </div>

        {/* Divider */}
        <div className='flex items-center gap-2 mb-6'>
          <div className='flex-grow border-t border-gray-200'></div>
          <div className='flex-grow border-t border-gray-200'></div>
        </div>

        {/* Signup Form */}
        <form
          className='flex flex-col gap-2 w-full max-w-md mb-6'
          onSubmit={handleSubmit}
        >
          <div className='flex flex-col gap-2'>
            <label className='text-gray-900 text-sm font-medium'>
              Full Name
            </label>
            <Input
              placeholder='Wade Warre'
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={`border ${
                activeInput === 'fullName'
                  ? 'border-green-400'
                  : 'border-[#BDBDBD]'
              } bg-white`}
              onFocus={() => handleFocus('fullName')}
              onBlur={handleBlur}
              required
            />
          </div>
          <div className='flex flex-col gap-2'>
            <label className='text-gray-900 text-sm font-medium'>
              Phone Number
            </label>
            <Input
              placeholder='09055555555'
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className={`border ${
                activeInput === 'phoneNumber'
                  ? 'border-green-400'
                  : 'border-[#BDBDBD]'
              } bg-white`}
              onFocus={() => handleFocus('phoneNumber')}
              onBlur={handleBlur}
              required
              pattern='^[0-9]{10,15}$'
              title='Enter a valid phone number'
            />
          </div>
          <div className='flex flex-col gap-2 relative'>
            <label className='text-gray-900 text-sm font-medium'>
              Password
            </label>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder='Create a password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`border ${
                activeInput === 'password'
                  ? 'border-green-400'
                  : 'border-[#BDBDBD]'
              } bg-white pr-10`}
              onFocus={() => handleFocus('password')}
              onBlur={handleBlur}
              required
             
            />
            <button
              type='button'
              onClick={togglePasswordVisibility}
              className='absolute inset-y-0 top-3 right-0 px-3 flex items-center text-gray-500'
            >
              {showPassword ? (
                <EyeSlashIcon className='h-5 w-5' />
              ) : (
                <EyeIcon className='h-5 w-5' />
              )}
            </button>
          </div>
          <div className='flex flex-col gap-2 relative'>
            <label className='text-gray-900 text-sm font-medium'>
              Confirm Password
            </label>
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder='Confirm your password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`border ${
                activeInput === 'confirmPassword'
                  ? 'border-green-400'
                  : 'border-[#BDBDBD]'
              } bg-white pr-10`}
              onFocus={() => handleFocus('confirmPassword')}
              onBlur={handleBlur}
              required
             
            />
            <button
              type='button'
              onClick={toggleConfirmPasswordVisibility}
              className='absolute inset-y-0 right-0 top-3 px-3 flex items-center text-gray-500'
            >
              {showConfirmPassword ? (
                <EyeSlashIcon className='h-5 w-5' />
              ) : (
                <EyeIcon className='h-5 w-5' />
              )}
            </button>
          </div>
          {errorMessage && <p className='text-red-600'>{errorMessage}</p>}
          <Button
            type='submit'
            className='w-full py-3 mt-3 bg-green-600 text-white text-base font-semibold rounded-full'
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Sign Up'}
          </Button>
        </form>
        <div className="text-green-600 text-sm pl-2 cursor-pointer" onClick={handlelogin}>
              or Login
          </div>
      </div>

      <div className='hidden sm:flex sm:w-1/2 relative bg-gray-100'>
        <Image
          src='/assets/amico.png'
          alt='Signup illustration'
          width={350}
          height={350}
          className='object-contain mx-auto m-0 p-0'
        />
      </div>
    </div>
  );
};

export default Signup;
