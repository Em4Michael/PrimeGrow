"use client";

import React, { useState } from "react";
import Image from "next/image";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Logo from "../../components/logo";
import { useRouter } from "next/navigation";
import Loading from "../../components/Loading"; // Import Loading component
import Notification from "../../components/Notification"; // Import Notification component
import { useAuth } from "../../app/context/AuthContext"; // Use AuthContext

const ForgetPassword = () => {
  const [activeInput, setActiveInput] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false); // State for loading
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null); // State for notification

  const router = useRouter();
  const { resetPassword } = useAuth(); // Reset Password function from context

  const handleFocus = (inputName: string) => setActiveInput(inputName);
  const handleBlur = () => setActiveInput(null);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation for passwords
    if (newPassword.length < 6) {
      setNotification({
        type: "error",
        message: "Password must be at least 6 characters long",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setNotification({
        type: "error",
        message: "Passwords do not match",
      });
      return;
    }

    setLoading(true);
    try {
      // Call resetPassword method from AuthContext
      await resetPassword(phoneNumber, newPassword, confirmPassword);
    } catch (error) {
      setNotification({ type: "error", message: "Failed to send code. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-[2rem] sm:p-[2rem] flex flex-col justify-center mt-[50px] gap-20">
      <Logo />
      <div className="flex flex-col items-center gap-5">
        <div className="text-center">
          <h2 className="text-gray-900 text-[18px] sm:text-3xl font-bold leading-snug mb-4">
            Forgot password?
          </h2>
          <p className="text-[14px] text-gray-600">
            Don’t worry! It happens. Please enter the Phone Number associated
            with your account.
          </p>
        </div>

        <form className="flex flex-col gap-2 w-full max-w-lg" onSubmit={handleSendCode}>
          <div className="flex flex-col gap-2">
            <label className="text-gray-900 text-xl font-medium">Phone Number</label>
            <Input
              placeholder="Enter your Phone number here"
              className={`border ${
                activeInput === "phoneNumber" ? "border-green-400" : "border-[#BDBDBD]"
              } bg-white`}
              onFocus={() => handleFocus("phoneNumber")}
              onBlur={handleBlur}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-gray-900 text-xl font-medium">New Password</label>
            <Input
              type="password"
              placeholder="Enter your new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={`border ${
                activeInput === "newPassword" ? "border-green-400" : "border-[#BDBDBD]"
              } bg-white`}
              onFocus={() => handleFocus("newPassword")}
              onBlur={handleBlur}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-gray-900 text-xl font-medium">Confirm Password</label>
            <Input
              type="password"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`border ${
                activeInput === "confirmPassword" ? "border-green-400" : "border-[#BDBDBD]"
              } bg-white`}
              onFocus={() => handleFocus("confirmPassword")}
              onBlur={handleBlur}
            />
          </div>

          <Button type="submit" className="w-full max-w-lg py-3 mt-3 bg-green-600 text-white text-base font-semibold rounded-full">
            Send Code
          </Button>
        </form>
      </div>

      {/* Show Loading and Notification Components */}
      {loading && <Loading />}
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};

export default ForgetPassword;
