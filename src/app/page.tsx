"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import Image from "next/image";

const usernameSchema = z.string().regex(/^\d{2}FE\d[a-zA-Z]\d{4}$/, {
  message: "Username must be 10 characters: 2 numbers, 'FE', 1 number, 1 letter, 4 numbers",
});
const passwordSchema = z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
  message: "Password must be at least 8 characters with 1 uppercase, 1 lowercase, 1 number, and 1 special character",
});
const emailSchema = z.string().email({ message: "Invalid email format" });

export default function Page() {
  const [isSignup, setIsSignup] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [formData, setFormData] = useState({ 
    username: "", 
    email: "", 
    password: "", 
    confirmPassword: "",
    otp: "" 
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");
      if (isSignup && !isForgotPassword && formData.password !== formData.confirmPassword) {
        throw new Error("Passwords do not match!!!");
      }
      if (!isForgotPassword) {
        usernameSchema.parse(formData.username);
        passwordSchema.parse(formData.password);
        if (isSignup) emailSchema.parse(formData.email);
      }

      let endpoint = "";
      let payload = {};

      if (isForgotPassword) {
        if (!showOtpInput && !showResetPassword) {
          endpoint = "/api/forgot-password";
          payload = { email: formData.email };
        } else if (showOtpInput && !showResetPassword) {
          endpoint = "/api/verify-forgot-otp";
          payload = { email: formData.email, otp: formData.otp };
        } else if (showResetPassword) {
          endpoint = "/api/reset-password";
          payload = { 
            email: formData.email, 
            password: formData.password, 
            confirmPassword: formData.confirmPassword 
          };
        }
      } else {
        endpoint = isSignup ? (showOtpInput ? "/api/verify-otp" : "/api/signup") : "/api/login";
        payload = isSignup 
          ? (showOtpInput 
            ? { username: formData.username, otp: formData.otp }
            : { 
                username: formData.username, 
                email: formData.email, 
                password: formData.password, 
                confirmPassword: formData.confirmPassword 
              })
          : { 
              username: formData.username, 
              password: formData.password 
            };
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Server error");
      
      if (isForgotPassword) {
        if (!showOtpInput && !showResetPassword) {
          setShowOtpInput(true);
          alert("OTP has been sent to your email. Please verify.");
        } else if (showOtpInput && !showResetPassword) {
          setShowOtpInput(false);
          setShowResetPassword(true);
          alert("OTP verified! Please enter your new password.");
        } else if (showResetPassword) {
          alert("Password reset successfully! Please login.");
          setIsForgotPassword(false);
          setShowResetPassword(false);
          setFormData({ username: "", email: "", password: "", confirmPassword: "", otp: "" });
        }
      } else if (isSignup && !showOtpInput) {
        setShowOtpInput(true);
        alert("OTP has been sent to your email. Please verify.");
      } else if (isSignup && showOtpInput) {
        alert("Successfully verified! Please login.");
        setIsSignup(false);
        setShowOtpInput(false);
      } else {
        const firstTwoChars = formData.username.slice(0, 2);
        const firstTwoNum = parseInt(firstTwoChars, 10);
        if (firstTwoNum > 20) {
          alert("Login successful as Student! Redirecting to Dashboard...");
          router.push(`/dashboard?username=${encodeURIComponent(formData.username)}`);
        }else{
          alert("Login successful as Alumni! Redirecting to Dashboard...");
          router.push(`/Almumnidashboard?username=${encodeURIComponent(formData.username)}`);
        }
      }
    } catch (error) {
      setErrorMessage(error+" Internal server error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setIsForgotPassword(true);
    setIsSignup(false);
    setShowOtpInput(false);
    setShowResetPassword(false);
    setFormData({ username: "", email: "", password: "", confirmPassword: "", otp: "" });
    setErrorMessage("");
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen items-center justify-center bg-black p-4">
      <div className="w-full max-w-md bg-white text-black p-6 sm:p-8 rounded-xl shadow-md border border-gray-300">
        <h1 className="text-3xl font-bold text-center mb-4">LARA CONNECT</h1>
        <h2 className="text-xl text-center font-semibold mb-4">
          {isSignup ? "Create an account" : isForgotPassword ? "Reset Password" : "Welcome Back"}
        </h2>

        {errorMessage && <p className="text-red-400 text-center mb-3">{errorMessage}</p>}

        {!isForgotPassword && !showOtpInput && (
          <>
            <input 
              type="text" 
              name="username" 
              placeholder="Username" 
              value={formData.username} 
              onChange={handleChange} 
              className="w-full p-3 mb-3 bg-white/10 border border-gray-400 rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
            />

            {isSignup && (
              <input 
                type="email" 
                name="email" 
                placeholder="Email" 
                value={formData.email} 
                onChange={handleChange} 
                className="w-full p-3 mb-3 bg-white/10 border border-gray-400 rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
              />
            )}

            <input 
              type="password" 
              name="password" 
              placeholder="Password" 
              value={formData.password} 
              onChange={handleChange} 
              className="w-full p-3 mb-3 bg-white/10 border border-gray-400 rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
            />

            {isSignup && (
              <input 
                type="password" 
                name="confirmPassword" 
                placeholder="Confirm Password" 
                value={formData.confirmPassword} 
                onChange={handleChange} 
                className="w-full p-3 mb-4 bg-white/10 border border-gray-400 rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
              />
            )}
          </>
        )}

        {isSignup && showOtpInput && !isForgotPassword && (
          <input 
            type="text" 
            name="otp" 
            placeholder="Enter 6-digit OTP" 
            value={formData.otp} 
            onChange={handleChange} 
            className="w-full p-3 mb-4 bg-white/10 border border-gray-400 rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
          />
        )}

        {isForgotPassword && !showOtpInput && !showResetPassword && (
          <input 
            type="email" 
            name="email" 
            placeholder="Enter your email" 
            value={formData.email} 
            onChange={handleChange} 
            className="w-full p-3 mb-4 bg-white/10 border border-gray-400 rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
          />
        )}

        {isForgotPassword && showOtpInput && !showResetPassword && (
          <input 
            type="text" 
            name="otp" 
            placeholder="Enter 6-digit OTP" 
            value={formData.otp} 
            onChange={handleChange} 
            className="w-full p-3 mb-4 bg-white/10 border border-gray-400 rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
          />
        )}

        {isForgotPassword && showResetPassword && (
          <>
            <input 
              type="password" 
              name="password" 
              placeholder="New Password" 
              value={formData.password} 
              onChange={handleChange} 
              className="w-full p-3 mb-3 bg-white/10 border border-gray-400 rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
            />
            <input 
              type="password" 
              name="confirmPassword" 
              placeholder="Confirm New Password" 
              value={formData.confirmPassword} 
              onChange={handleChange} 
              className="w-full p-3 mb-4 bg-white/10 border border-gray-400 rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
            />
          </>
        )}

        <button 
          onClick={handleSubmit} 
          disabled={isLoading}
          className={`w-full p-3 rounded-lg text-white font-bold shadow-md shadow-blue-500/50 transition-all duration-300 ${
            isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isLoading ? "Loading..." : isForgotPassword 
            ? (showResetPassword ? "Reset Password" : showOtpInput ? "Verify OTP" : "Send OTP") 
            : isSignup 
              ? (showOtpInput ? "Verify OTP" : "Sign Up") 
              : "Login"}
        </button>

        <p className="mt-4 text-center">
          {isSignup && !isForgotPassword ? "Already have an account? " : isForgotPassword ? "Back to " : "New user? "}
          <button 
            onClick={() => {
              if (isForgotPassword) {
                setIsForgotPassword(false);
                setIsSignup(false);
              } else {
                setIsSignup(!isSignup);
              }
              setShowOtpInput(false);
              setShowResetPassword(false);
              setFormData({ username: "", email: "", password: "", confirmPassword: "", otp: "" });
              setErrorMessage("");
            }} 
            className="text-yellow-300 hover:underline"
          >
            {isSignup && !isForgotPassword ? "Login" : isForgotPassword ? "Login" : "Sign Up"}
          </button>
          {!isSignup && !isForgotPassword && (
            <>
              {" | "}
              <button 
                onClick={handleForgotPassword}
                className="text-yellow-300 hover:underline"
              >
                Forgot Password?
              </button>
            </>
          )}
        </p>
      </div>

      <div className="hidden md:flex flex-col items-center justify-center ml-10 text-center">
        <div className="flex items-center space-x-4">
          <Image src="/laralogo.jpg" alt="College Logo" width={60} height={60} />
          <div>
            <h2 className="text-4xl font-bold text-white glow-text">VIGNAN&apos;S LARA</h2>
            <h2 className="text-sm font-bold text-white drop-shadow-md font-sans">INSTITUTE OF TECHNOLOGY & SCIENCE</h2>
            <p className="text-white">--------------Autonomous--------------</p>
          </div>
        </div>
        <Image src="/lara1.jpg" alt="Campus image" width={600} height={300} className="object-cover rounded-lg shadow-lg w-full h-auto mt-6" />
      </div>
    </div>
  );
}