import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SpLoader from "../utils/spinloader";

const User = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const toggleForm = () => setIsSignUp(!isSignUp);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const url = isSignUp
      ? "http://localhost:5000/usr/register"
      : "http://localhost:5000/usr/login";
    const formData = new FormData(event.target);
    const requestBody = {
      identifier: formData.get("identifier"),
      password: formData.get("password"),
      ...(isSignUp && {
        name: formData.get("name"),
        email: formData.get("email"),
        username: formData.get("username"),
        phoneNumber: formData.get("phoneNumber"),
        confirm_password: formData.get("repeatPassword"),
      }),
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const responseData = await response.json();
        localStorage.setItem("authorization", responseData.token);
        toast.success("Success! Redirecting to the dashboard...");
        setTimeout(() => navigate("/dashboard"), 2000);
      } else {
        const errorData = await response.json();
        toast.error("Error: " + errorData.error);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {loading && <SpLoader />}
      {!loading && (
        <div className="bg-white shadow-lg rounded-xl p-8 w-96">
          <h2 className="text-2xl font-semibold text-center text-gray-700">
            {isSignUp ? "Sign Up" : "Log In"}
          </h2>
          <p className="text-center text-gray-500 mb-4">
            {isSignUp ? "Create your account" : "Welcome back!"}
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  className="w-full p-2 border rounded-md"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full p-2 border rounded-md"
                  required
                />
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  className="w-full p-2 border rounded-md"
                  required
                />
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="Phone Number"
                  className="w-full p-2 border rounded-md"
                  required
                />
              </>
            )}
            {!isSignUp && (
              <input
                type="text"
                name="identifier"
                placeholder="Email or Username"
                className="w-full p-2 border rounded-md"
                required
              />
            )}
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full p-2 border rounded-md"
              required
            />
            {isSignUp && (
              <input
                type="password"
                name="repeatPassword"
                placeholder="Confirm Password"
                className="w-full p-2 border rounded-md"
                required
              />
            )}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
            >
              {isSignUp ? "Sign Up" : "Log In"}
            </button>
          </form>
          <div className="text-center mt-4">
            <button
              onClick={toggleForm}
              className="text-blue-500 hover:underline"
            >
              {isSignUp
                ? "Already have an account? Log In"
                : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default User;