"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import Image from "next/image";

const usernameSchema = z.string().regex(/^[0-9]{2}FE[0-9][a-zA-Z][0-9]{4}$/);
const passwordSchema = z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/);
const emailSchema = z.string().email();

export default function Page() {
  const [isSignup, setIsSignup] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [formData, setFormData] = useState({ username: "", email: "", password: "", confirmPassword: "", otp: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e : React.ChangeEvent<HTMLInputElement> ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      if (isSignup && !isForgotPassword && formData.password !== formData.confirmPassword) {
        throw new Error("Passwords do not match");
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
          payload = { email: formData.email, password: formData.password, confirmPassword: formData.confirmPassword };
        }
      } else {
        endpoint = isSignup ? (showOtpInput ? "/api/verify-otp" : "/api/signup") : "/api/login";
        payload = isSignup
          ? showOtpInput
            ? { username: formData.username, otp: formData.otp }
            : { username: formData.username, email: formData.email, password: formData.password, confirmPassword: formData.confirmPassword }
          : { username: formData.username, password: formData.password };
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
          alert("OTP sent. Check your email.");
        } else if (showOtpInput && !showResetPassword) {
          setShowOtpInput(false);
          setShowResetPassword(true);
        } else if (showResetPassword) {
          alert("Password reset successful");
          setIsForgotPassword(false);
          setShowResetPassword(false);
          setFormData({ username: "", email: "", password: "", confirmPassword: "", otp: "" });
        }
      } else if (isSignup && !showOtpInput) {
        setShowOtpInput(true);
        alert("OTP sent. Check your email.");
      } else if (isSignup && showOtpInput) {
        alert("Verified successfully. Please login.");
        setIsSignup(false);
        setShowOtpInput(false);
      } else {
        const firstTwoNum = parseInt(formData.username.slice(0, 2), 10);
        const isStudent = firstTwoNum > 20;
        alert("Login successful. Redirecting to Dashboard");
        router.push(`/${isStudent ? "dashboard" : "Almumnidashboard"}?username=${encodeURIComponent(formData.username)}`);
      }
    } catch (error) {
      setErrorMessage( "Internal server error");
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
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-4">LARA CONNECT</h1>
        <h2 className="text-lg text-center mb-4">
          {isSignup ? "Create Account" : isForgotPassword ? "Reset Password" : "Login"}
        </h2>

        {errorMessage && <p className="text-red-500 text-center mb-3">{errorMessage}</p>}

        {!isForgotPassword && !showOtpInput && (
          <>
            <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} className="input" />
            {isSignup && <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="input" />}
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="input" />
            {isSignup && <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} className="input" />}
          </>
        )}

        {(showOtpInput || (isForgotPassword && showOtpInput)) && (
          <input type="text" name="otp" placeholder="Enter OTP" value={formData.otp} onChange={handleChange} className="input" />
        )}

        {isForgotPassword && !showOtpInput && !showResetPassword && (
          <input type="email" name="email" placeholder="Enter Email" value={formData.email} onChange={handleChange} className="input" />
        )}

        {isForgotPassword && showResetPassword && (
          <>
            <input type="password" name="password" placeholder="New Password" value={formData.password} onChange={handleChange} className="input" />
            <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} className="input" />
          </>
        )}

        <button onClick={handleSubmit} disabled={isLoading} className="btn">
          {isLoading ? "Loading..." : isForgotPassword ? (showResetPassword ? "Reset Password" : showOtpInput ? "Verify OTP" : "Send OTP") : isSignup ? (showOtpInput ? "Verify OTP" : "Sign Up") : "Login"}
        </button>

        <p className="mt-4 text-center text-sm">
          {isSignup ? "Already have an account?" : isForgotPassword ? "Back to" : "New user?"}{" "}
          <button
            onClick={() => {
              setIsSignup(isForgotPassword ? false : !isSignup);
              setIsForgotPassword(false);
              setShowOtpInput(false);
              setShowResetPassword(false);
              setFormData({ username: "", email: "", password: "", confirmPassword: "", otp: "" });
              setErrorMessage("");
            }}
            className="text-blue-600 hover:underline"
          >
            {isSignup ? "Login" : isForgotPassword ? "Login" : "Sign Up"}
          </button>
          {!isSignup && !isForgotPassword && (
            <>
              {" | "}
              <button onClick={handleForgotPassword} className="text-blue-600 hover:underline">
                Forgot Password?
              </button>
            </>
          )}
        </p>
      </div>

      <div className="hidden md:flex flex-col items-center justify-center ml-8">
        <div className="flex items-center space-x-4 mb-4">
          <Image src="/laralogo.jpg" alt="College Logo" width={60} height={60} />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">VIGNAN&apos;S LARA</h2>
            <h3 className="text-sm font-medium text-gray-600">INSTITUTE OF TECHNOLOGY & SCIENCE</h3>
            <p className="text-gray-500 text-xs">Autonomous</p>
          </div>
        </div>
        <Image src="/lara1.jpg" alt="Campus image" width={500} height={300} className="rounded shadow" />
      </div>
    </div>
  );
}

// Utility classes
const inputClass = "w-full p-3 mb-3 border rounded focus:outline-none focus:ring focus:border-blue-300";
const btnClass = "w-full p-3 rounded text-white font-semibold bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400";

// Add Tailwind classes directly or use a global CSS file for `.input` and `.btn