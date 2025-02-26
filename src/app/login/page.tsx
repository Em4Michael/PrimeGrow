"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://primegrow-server.onrender.com';

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [activeInput, setActiveInput] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const router = useRouter();

  const handleFocus = (inputName: string) => setActiveInput(inputName);
  const handleBlur = () => setActiveInput(null);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleClick = () => router.push('/');
  const handleSign = () => router.push('/signup');

  const validateInputs = () => {
    let isValid = true;
    if (!/^\d{11}$/.test(phoneNumber)) {
      setPhoneError('Phone number is invalid');
      isValid = false;
    } else setPhoneError(null);

    if (password.trim() === '') {
      setPasswordError('Password is required');
      isValid = false;
    } else setPasswordError(null);

    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (validateInputs()) {
      try {
        const response = await axios.post(`${API_URL}/api/auth/login`, {
          phoneNumber,
          password,
        });

        if (response.status === 200) {
          const { token, role, ...rest } = response.data;
          if (token && role) {
            const user = { role, ...rest };
            Cookies.set('token', token, { expires: 1, sameSite: 'strict', secure: true });
            Cookies.set('user', JSON.stringify(user), { expires: 1, sameSite: 'strict', secure: true });

            switch (role) {
              case 'user':
                router.push('/home');
                break;
              case 'admin':
                router.push('/reports');
                break;
              case 'superadmin':
                router.push('/dashboard');
                break;
              default:
                router.push('/forbidden');
            }
          } else {
            console.error('Token or role missing in response');
          }
        }
      } catch (error) {
        console.error('Login failed', error);
        setPhoneError('Invalid login credentials');
      }
    }
  };

  const handleForgotPassword = () => router.push('/forgetPassword');

  return (
    // JSX remains unchanged
    <div className="flex flex-col sm:flex-row-reverse w-full min-h-screen bg-white rounded-2xl overflow-hidden">
      <div className='flex items-center fixed w-full bg-white top-0 z-10 left-0 p-4'>
        <div className='flex items-center cursor-pointer' onClick={handleClick}>
          <Image src='/assets/logo2.png' alt='logo' width={60} height={60} />
          <h1 className='text-xl font-bold ml-2'>Prime Grow</h1>
        </div>
      </div>

      <div className="flex-1 p-[2rem] sm:p-[2rem] flex flex-col justify-center items-center ml-2 sm:ml-4 m-auto">
        <div className="mb-6 mt-[0px]">
          <div className="text-gray-900 text-[18px] sm:text-3xl font-bold leading-snug">
            Welcome Back to Prime Grow Farm
          </div>
          <div className="text-gray-500 text-[14px] mt-2">
            Log in to continue ordering fresh tomatoes direct from our farm
          </div>
        </div>

        <form className="flex flex-col gap-2 mb-6 w-full max-w-md" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label className="text-gray-900 text-sm font-medium">Phone Number</label>
            <Input
              type="text"
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className={`border ${phoneError ? 'border-red-600' : activeInput === 'phoneNumber' ? 'border-green-400' : 'border-[#BDBDBD]'} bg-white`}
              onFocus={() => handleFocus('phoneNumber')}
              onBlur={handleBlur}
            />
            {phoneError && <p className="text-red-600 text-sm">{phoneError}</p>}
          </div>

          <div className="flex flex-col gap-2 relative">
            <label className="text-gray-900 text-sm font-medium">Password</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`border ${passwordError ? 'border-red-600' : activeInput === 'password' ? 'border-green-400' : 'border-[#BDBDBD]'} bg-white pr-10`}
                onFocus={() => handleFocus('password')}
                onBlur={handleBlur}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute bottom-3 inset-y-0 right-3 flex items-center text-gray-500"
              >
                {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
            {passwordError && <p className="text-red-600 text-sm">{passwordError}</p>}
          </div>
          <span className="flex flex-row">
            <div className="text-gray-500 text-sm cursor-pointer" onClick={handleForgotPassword}>
              Forgot Password?
            </div>
            <div className="text-green-600 text-sm pl-2 cursor-pointer" onClick={handleSign}>
              or Signin
            </div>
          </span>
          <Button
            type="submit"
            className="w-full py-3 mt-3 bg-green-600 text-white text-base font-semibold rounded-full"
          >
            Log In
          </Button>
        </form>
      </div>

      <div className="hidden sm:flex sm:w-1/2 relative bg-gray-100">
        <Image
          src="/assets/amico.png"
          alt="Login illustration"
          width={280}
          height={280}
          className="object-contain mx-auto m-0 p-0"
        />
      </div>
    </div>
  );
};

export default Login;