"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import Image from "next/image";

const usernameSchema = z.string().regex(/^[a-zA-Z0-9]{4,20}$/, {
  message: "Username must be alphanumeric and 4-20 characters long",
});
const passwordSchema = z
  .string()
  .min(8)
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
    message:
      "Password must be at least 8 characters with 1 uppercase, 1 lowercase, 1 number, and 1 special character",
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
    otp: "",
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
      if (
        isSignup &&
        !isForgotPassword &&
        formData.password !== formData.confirmPassword
      ) {
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
            confirmPassword: formData.confirmPassword,
          };
        }
      } else {
        endpoint = isSignup
          ? showOtpInput
            ? "/api/verify-otp"
            : "/api/signup"
          : "/api/login";
        payload = isSignup
          ? showOtpInput
            ? { username: formData.username, otp: formData.otp }
            : {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                confirmPassword: formData.confirmPassword,
              }
          : {
              username: formData.username,
              password: formData.password,
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
          alert("OTP sent to email. Please verify.");
        } else if (showOtpInput && !showResetPassword) {
          setShowOtpInput(false);
          setShowResetPassword(true);
          alert("OTP verified! Enter new password.");
        } else if (showResetPassword) {
          alert("Password reset successfully!");
          setIsForgotPassword(false);
          setShowResetPassword(false);
          setFormData({
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            otp: "",
          });
        }
      } else if (isSignup && showOtpInput) {
        alert("Successfully verified! Please login.");
        setIsSignup(false);
        setShowOtpInput(false);
      } else if (isSignup && !showOtpInput) {
        setShowOtpInput(true);
        alert("OTP sent to email. Please verify.");
      } else {
        alert("Login successful! Redirecting to Dashboard...");
        router.push(
          `/dashboard?username=${encodeURIComponent(formData.username)}`
        );
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
    setFormData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      otp: "",
    });
    setErrorMessage("");
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen items-center justify-center bg-black p-4">
      <div className="w-full max-w-md bg-white text-black p-6 sm:p-8 rounded-xl shadow-md border border-gray-300">
        <h1 className="text-3xl font-bold text-center mb-4">LARA CONNECT</h1>
        <h2 className="text-md text-center font-medium mb-4">
          {isSignup
            ? "Create an account"
            : isForgotPassword
            ? "Reset Password"
            : "Welcome Back"}
        </h2>

        {errorMessage && (
          <p className="text-red-600 text-center mb-4 text-sm font-semibold">
            {errorMessage}
          </p>
        )}

        {!isForgotPassword && !showOtpInput && (
          <>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full mb-3 px-4 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-black"
            />
            {isSignup && (
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full mb-3 px-4 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-black"
              />
            )}
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full mb-3 px-4 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-black"
            />
            {isSignup && (
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full mb-3 px-4 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-black"
              />
            )}
          </>
        )}

        {(isSignup || isForgotPassword) && showOtpInput && (
          <input
            type="text"
            name="otp"
            placeholder="Enter 6-digit OTP"
            value={formData.otp}
            onChange={handleChange}
            className="w-full mb-3 px-4 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-black"
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
              className="w-full mb-3 px-4 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-black"
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm New Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full mb-3 px-4 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-black"
            />
          </>
        )}

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className={`w-full py-2 px-4 mt-2 bg-black text-white rounded hover:bg-gray-900 transition ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading
            ? "Loading..."
            : isForgotPassword
            ? showResetPassword
              ? "Reset Password"
              : showOtpInput
              ? "Verify OTP"
              : "Send OTP"
            : isSignup
            ? showOtpInput
              ? "Verify OTP"
              : "Sign Up"
            : "Login"}
        </button>

        <p className="mt-4 text-center text-sm">
          {isSignup && !isForgotPassword
            ? "Already have an account? "
            : isForgotPassword
            ? "Back to "
            : "New user? "}
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
              setFormData({
                username: "",
                email: "",
                password: "",
                confirmPassword: "",
                otp: "",
              });
              setErrorMessage("");
            }}
            className="text-black underline font-semibold"
          >
            {isSignup && !isForgotPassword
              ? "Login"
              : isForgotPassword
              ? "Login"
              : "Sign Up"}
          </button>
          {!isSignup && !isForgotPassword && (
            <>
              {" | "}
              <button
                onClick={handleForgotPassword}
                className="text-black underline font-semibold"
              >
                Forgot Password?
              </button>
            </>
          )}
        </p>
      </div>

      <div className="w-full max-w-2xl mt-10 md:mt-0 hidden md:flex flex-col items-center justify-center ml-10 text-center">
        <div className="flex items-center space-x-4">
          <Image src="/laralogo.jpg" alt="College Logo" width={60} height={60} />
          <div className="text-white">
            <h2 className="text-2xl font-bold">VIGNAN&apos;S LARA</h2>
            <h2 className="text-sm font-medium">INSTITUTE OF TECHNOLOGY & SCIENCE</h2>
            <p className="text-sm">--------------Autonomous--------------</p>
          </div>
        </div>
        <Image
          src="/lara1.jpg"
          alt="Campus image"
          width={600}
          height={300}
          className="object-cover rounded-lg shadow-lg w-full h-auto mt-6"
        />
      </div>
    </div>
  );
}
