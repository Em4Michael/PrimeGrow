'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie'; // Corrected import
import axios from 'axios';

interface User {
  userId: string;
  role: string;
  name: string;
  phoneNumber: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (data: any) => void;
  signup: (data: { fullName: string; phoneNumber: string; password: string }) => Promise<void>;
  verifyOtp: (otp: string) => Promise<boolean>;
  verifyOtpPass: (otp: string) => Promise<boolean>;
  resetPassword: (phoneNumber: string, newPassword: string, confirmPassword: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    const storedUser = Cookies.get('user');

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data from cookies:', error);
        Cookies.remove('token');
        Cookies.remove('user');
      }
    }

    setLoading(false);
  }, []);

  const login = (data: any) => {
    Cookies.set('token', data.token, { expires: 1 });
    Cookies.set('user', JSON.stringify(data.user), { expires: 1 });
    setUser(data.user);
    router.push('/profile');
  };

  const signup = async (signupData: { fullName: string; phoneNumber: string; password: string }) => {
    try {
      localStorage.setItem('signupData', JSON.stringify(signupData));
      const otpResponse = await axios.post('http://localhost:5000/api/otp/send', {
        phoneNumber: signupData.phoneNumber,
      });

      if (otpResponse.status === 200) {
        router.push('/verifyPhoneNumber');
      } else {
        throw new Error('Failed to send OTP');
      }
    } catch (error) {
      console.error('Signup Error:', error);
      throw error;
    }
  };

  const verifyOtp = async (otp: string): Promise<boolean> => {
    try {
      const storedData = localStorage.getItem('signupData');
      if (!storedData) throw new Error('Signup data not found.');

      const { fullName, phoneNumber, password } = JSON.parse(storedData);
      const verifyResponse = await axios.post('http://localhost:5000/api/otp/verify', {
        phoneNumber,
        otp,
      });

      if (verifyResponse.status === 200) {
        const signupResponse = await axios.post('http://localhost:5000/api/auth/signup', {
          fullName,
          phoneNumber,
          password,
        });

        if (signupResponse.status === 201) {
          if (signupResponse.data.token && signupResponse.data.user) {
            login({ token: signupResponse.data.token, user: signupResponse.data.user });
          } else {
            localStorage.removeItem('signupData');
            router.push('/login');
          }
          return true;
        } else {
          throw new Error('Error signing up. Please try again.');
        }
      } else {
        throw new Error('Incorrect OTP. Please try again.');
      }
    } catch (error) {
      console.error('OTP Verification Error:', error);
      throw error;
    }
  };

  const resetPassword = async (phoneNumber: string, newPassword: string, confirmPassword: string) => {
    try {
      if (newPassword !== confirmPassword) throw new Error("Passwords do not match");

      localStorage.setItem('resetPasswordData', JSON.stringify({
        phoneNumber,
        newPassword,
        confirmPassword,
      }));

      const otpResponse = await axios.post('http://localhost:5000/api/otp/send', { phoneNumber });
      if (otpResponse.status === 200) {
        router.push('/resetverify');
      } else {
        throw new Error('Failed to send OTP');
      }
    } catch (error) {
      console.error('Reset Password Error:', error);
      throw error;
    }
  };

  const verifyOtpPass = async (otp: string): Promise<boolean> => {
    try {
      const storedData = localStorage.getItem('resetPasswordData');
      if (!storedData) throw new Error('Reset data not found.');

      const { phoneNumber, newPassword, confirmPassword } = JSON.parse(storedData);
      const verifyResponse = await axios.post('http://localhost:5000/api/otp/verify', {
        phoneNumber,
        otp,
      });

      if (verifyResponse.status === 200) {
        const resetResponse = await axios.post('http://localhost:5000/api/auth/reset-password', {
          phoneNumber,
          newPassword,
          confirmPassword,
        });

        if (resetResponse.status === 200) {
          localStorage.removeItem('resetPasswordData');
          router.push('/login');
          return true;
        } else {
          throw new Error('Failed to reset password. Please try again.');
        }
      } else {
        throw new Error('Incorrect OTP. Please try again.');
      }
    } catch (error) {
      console.error('OTP Verification Error:', error);
      throw error;
    }
  };

  const logout = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, verifyOtp, verifyOtpPass, resetPassword, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};