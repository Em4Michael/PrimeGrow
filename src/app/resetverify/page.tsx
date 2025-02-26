'use client';
import React, { useState, useRef, useEffect } from 'react';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useRouter } from 'next/navigation';
import Logo from '../../components/logo';
import Loading from '../../components/Loading';
import Notification from '../../components/Notification';
import axios from 'axios';
import { useAuth } from '../../app/context/AuthContext';

const initialTime = 120; // 2 minutes in seconds
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://primegrow-server.onrender.com';

const VerifyPhoneNumber = () => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [showResend, setShowResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const { verifyOtpPass } = useAuth();

  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setInterval(
        () => setTimeRemaining((prev) => prev - 1),
        1000
      );
      return () => clearInterval(timer);
    } else {
      setShowResend(true);
    }
  }, [timeRemaining]);

  const handleOtpChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;

    if (/^[0-9]$/.test(value) || value === '') {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value !== '' && index < 5 && inputsRef.current[index + 1]) {
        inputsRef.current[index + 1]?.focus();
      } else if (value === '' && index > 0 && inputsRef.current[index - 1]) {
        inputsRef.current[index - 1]?.focus();
      }

      setIsButtonDisabled(newOtp.includes(''));
    }
  };

  const handleVerify = async () => {
    setIsLoading(true);
    const otpCode = otp.join('');

    try {
      const isVerified = await verifyOtpPass(otpCode);

      if (isVerified) {
        setNotification({
          type: 'success',
          message: 'Password reset successfully!',
        });
        router.push('/login');
      } else {
        setNotification({
          type: 'error',
          message: 'OTP verification failed. Please try again.',
        });
      }
    } catch (error) {
      console.error('Error during OTP verification:', error);
      setNotification({
        type: 'error',
        message: 'Error verifying OTP. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      const storedData = localStorage.getItem('resetPasswordData');
      if (storedData) {
        const { phoneNumber } = JSON.parse(storedData);
        await axios.post(`${API_URL}/api/otp/send`, { phoneNumber });
        setTimeRemaining(initialTime);
        setShowResend(false);
        setNotification({
          type: 'success',
          message: 'OTP resent successfully!',
        });
      } else {
        setNotification({ type: 'error', message: 'Reset data not found.' });
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
      setNotification({
        type: 'error',
        message: 'Error resending OTP. Please try again.',
      });
    }
  };

  return (
    // JSX remains unchanged
    <div className="flex-1 mt-[100px] p-2 sm:p-2 flex flex-col justify-center gap-20 overflow-hidden">
      <Logo />
      <div className="flex flex-col items-center gap-10">
        <div className="text-center text-gray-900 text-2xl font-bold">
          Verify Your Phone Number
        </div>
        <div className="text-center text-gray-500 text-base">
          Enter the authentication code we sent to your phone number.
        </div>
        <div className="flex justify-center items-center gap-2 md:gap-4 max-w-lg">
          {[...Array(6)].map((_, index) => (
            <Input
              key={index}
              ref={(el) => {
                inputsRef.current[index] = el;
              }}
              type="text"
              maxLength={1}
              value={otp[index]}
              className={`bg-white text-center w-10 h-10 md:w-10 md:h-12 border ${
                errorMessage ? 'border-red-600' : 'border-gray-400'
              } rounded-lg text-xl`}
              onChange={(e) => handleOtpChange(e, index)}
            />
          ))}
        </div>
        {errorMessage && (
          <div className="text-center">
            <p className="text-red-600 text-sm">{errorMessage}</p>
          </div>
        )}
        <Button
          type="button"
          className={`w-full py-3 mt-4 ${
            isButtonDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600'
          } text-white text-base font-semibold rounded-lg max-w-lg`}
          onClick={handleVerify}
          disabled={isButtonDisabled}
        >
          {isButtonDisabled
            ? showResend
              ? 'Resend Code'
              : `Request Again in ${formatTime(timeRemaining)}`
            : 'Verify Code'}
        </Button>
        <div className="w-full text-center mt-4">
          <span className="text-gray-500 text-sm">
            Didn’t receive the code?
          </span>
          <span
            className={`text-blue-500 text-sm font-medium cursor-pointer ml-1 ${
              showResend ? '' : 'hidden'
            }`}
            onClick={handleResend}
          >
            Request Again
          </span>
        </div>
      </div>
      {isLoading && <Loading />}
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );

  function formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  }
};

export default VerifyPhoneNumber;