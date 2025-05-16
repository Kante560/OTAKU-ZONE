import React, { useState, useContext } from "react";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    gender: "", // Add gender field
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dashboard, setDashboard] = useState(null); // For dashboard data
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const validate = () => {
    if (!formData.full_name.trim()) return "full_name is required.";
    if (!formData.email.trim()) return "Email is required.";
    // Simple email regex
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      return "Invalid email address.";
    if (!formData.password) return "Password is required.";
    if (formData.password.length < 6)
      return "Password must be at least 6 characters.";
    if (!formData.gender.trim()) return "Gender is required.";
    if (formData.gender.length < 1 || formData.gender.length > 10)
      return "Gender must be between 1 and 10 characters.";
    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    try {
      // Make sure these keys/values match the server's expected format
      const response = await fetch("https://otaku-hub-api.vercel.app/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: formData.full_name, // required by server
          email: formData.email,       // must be valid email
          password: formData.password, // must meet server requirements
          gender: formData.gender,     // Send gender in the request
        }),
      });

      let data = null;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      }

      if (!response.ok) {
        if (data && data.error) {
          setError(data.error);
        } else if (data && data.message) {
          setError(data.message);
        } else if (response.status === 409) {
          setError("Email already exists.");
        } else {
          setError("Failed to signup. Please try again.");
          console.log("Error response:", data.message);
        }
        setLoading(false);
        return;
      }

      // Store email in localStorage
      localStorage.setItem("user_email", formData.email); // for signup
      // Store signup info for fallback in user page
      localStorage.setItem("signup_info", JSON.stringify({
        full_name: formData.full_name,
        gender: formData.gender,
        email: formData.email
      }));

      // Success: fetch dashboard info
      // Use email as id if that's what your backend expects
      const dashboardRes = await fetch(
        `https://otaku-hub-api.vercel.app/json/dashboard_read/${formData.email}`
      );
      if (dashboardRes.ok) {
        const dashboardData = await dashboardRes.json();
        setDashboard(dashboardData);
        // Optionally, store dashboardData in localStorage or context
      }

      login();
      navigate("/"); // Redirect to homepage
    } catch (err) {
      if (err.name === "TypeError") {
        setError("Network error. Please check your connection.");
      } else {
        setError(err.message || "An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Signup</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
          {/* Gender field */}
          <div className="mb-4">
            <label className="block text-gray-700">Gender</label>
            <input
              type="text"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
              minLength={1}
              maxLength={10}
              placeholder="Enter your gender"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
                Signing up...
              </>
            ) : (
              "Signup"
            )}
          </button>
        </form>
        {/* Optionally show dashboard info after signup */}
        {dashboard && (
          <div className="mt-6 p-4 bg-purple-50 rounded">
            <h3 className="font-bold mb-2">Dashboard Info</h3>
            <div><b>Name:</b> {dashboard.name}</div>
            <div><b>Gender:</b> {dashboard.gender}</div>
            <div><b>Post count:</b> {dashboard.post_count}</div>
            {dashboard.image && (
              <img src={dashboard.image} alt="User" className="w-24 h-24 rounded-full mt-2" />
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Signup;