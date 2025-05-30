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
      } else if (isSignup && showOtpInput) {
        alert("Successfully verified! Please login.");
        setIsSignup(false);
        setShowOtpInput(false);
      } else if (isSignup && !showOtpInput) {
        setShowOtpInput(true);
        alert("OTP has been sent to your email. Please verify.");
      } else {
        const firstTwoChars = formData.username.slice(0, 2);
        const firstTwoNum = parseInt(firstTwoChars, 10);
        if (firstTwoNum > 20) {
          alert("Login successful as Student! Redirecting to Dashboard...");
          router.push(`/dashboard?username=${encodeURIComponent(formData.username)}`);
        } else {
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
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-black px-6 py-10">
      <div className="md:w-2/5 w-full max-w-md bg-black/50 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/10 text-white">
        <h1 className="text-4xl font-extrabold text-white font-serif text-center mb-6 italic tracking-wider glow-text">LARA CONNECT</h1>
        <h2 className="text-2xl text-center font-medium mb-5">
          {isSignup ? "Create an account" : isForgotPassword ? "Reset Password" : "Welcome Back"}
        </h2>

        {errorMessage && <p className="text-red-400 text-center mb-4 font-semibold">{errorMessage}</p>}

        {/* Input fields here remain unchanged */}

        <button 
          onClick={handleSubmit} 
          disabled={isLoading}
          className={`w-full p-3 rounded-xl font-bold shadow-md transition-all duration-300 text-lg tracking-wide mt-2 ${
            isLoading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {isLoading ? "Loading..." : isForgotPassword 
            ? (showResetPassword ? "Reset Password" : showOtpInput ? "Verify OTP" : "Send OTP") 
            : isSignup 
              ? (showOtpInput ? "Verify OTP" : "Sign Up") 
              : "Login"}
        </button>

        <p className="mt-6 text-center text-sm">
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
            className="text-blue-300 hover:underline font-semibold"
          >
            {isSignup && !isForgotPassword ? "Login" : isForgotPassword ? "Login" : "Sign Up"}
          </button>
          {!isSignup && !isForgotPassword && (
            <>
              {" | "}
              <button 
                onClick={handleForgotPassword}
                className="text-blue-300 hover:underline font-semibold"
              >
                Forgot Password?
              </button>
            </>
          )}
        </p>
      </div>

      <div className="hidden md:flex flex-col items-center justify-center md:w-1/2 text-center px-6">
        <div className="flex items-center space-x-4 mb-6">
          <Image src="/laralogo.jpg" alt="College Logo" width={60} height={60} />
          <div>
            <h2 className="text-4xl font-bold text-white glow-text">VIGNAN&apos;S LARA</h2>
            <h3 className="text-sm font-semibold text-white tracking-widest">INSTITUTE OF TECHNOLOGY & SCIENCE</h3>
            <p className="text-white mt-1">--------------Autonomous--------------</p>
          </div>
        </div>
        <Image src="/lara1.jpg" alt="Campus image" width={600} height={300} className="rounded-2xl shadow-lg object-cover" />
      </div>
    </div>
  );
}