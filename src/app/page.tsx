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

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
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
      setErrorMessage(error + " Internal server error");
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
    <div className="flex flex-col md:flex-row min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full md:w-1/2 max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">LARA CONNECT</h1>
        <h2 className="text-lg text-center font-medium text-gray-700 mb-4">
          {isSignup ? "Create an account" : isForgotPassword ? "Reset Password" : "Welcome Back"}
        </h2>

        {errorMessage && <p className="text-red-600 text-center mb-3 text-sm">{errorMessage}</p>}

        {/* Form fields here, same as before */}

        {/* Buttons */}
        <button 
          onClick={handleSubmit} 
          disabled={isLoading}
          className={`w-full p-3 rounded-lg font-semibold text-white transition-colors duration-300 text-sm ${
            isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isLoading ? "Loading..." : isForgotPassword 
            ? (showResetPassword ? "Reset Password" : showOtpInput ? "Verify OTP" : "Send OTP") 
            : isSignup 
              ? (showOtpInput ? "Verify OTP" : "Sign Up") 
              : "Login"}
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
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
            className="text-blue-600 hover:underline"
          >
            {isSignup && !isForgotPassword ? "Login" : isForgotPassword ? "Login" : "Sign Up"}
          </button>
          {!isSignup && !isForgotPassword && (
            <>
              {" | "}
              <button 
                onClick={handleForgotPassword}
                className="text-blue-600 hover:underline"
              >
                Forgot Password?
              </button>
            </>
          )}
        </p>
      </div>

      <div className="hidden md:flex md:w-1/2 flex-col items-center justify-center text-center p-6">
        <div className="flex items-center space-x-4 mb-4">
          <Image src="/laralogo.jpg" alt="College Logo" width={60} height={60} />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">VIGNAN'S LARA</h2>
            <h3 className="text-sm text-gray-600">INSTITUTE OF TECHNOLOGY & SCIENCE</h3>
            <p className="text-gray-500 text-xs">--------------Autonomous--------------</p>
          </div>
        </div>
        <Image src="/lara1.jpg" alt="Campus image" width={600} height={300} className="object-cover rounded-md shadow-md w-full h-auto" />
      </div>
    </div>
  );
}