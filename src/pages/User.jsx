import React, { useEffect, useState, useContext } from "react";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";

const User = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("access");
        const email = localStorage.getItem("user_email");
        const signupInfo = JSON.parse(localStorage.getItem("signup_info") || "null");
        let mergedInfo = signupInfo || {};

        if (token && email) {
          // Fetch dashboard info using email as id
          const response = await fetch(`https://otaku-hub-api.vercel.app/json/dashboard_read/${email}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            // Merge dashboard data with signup info (signup info takes precedence if dashboard field is missing)
            mergedInfo = { ...data, ...mergedInfo };
          }
        }
        setUserInfo(mergedInfo && Object.keys(mergedInfo).length > 0 ? mergedInfo : null);
      } catch (err) {
        // Fallback to signup info if API fails
        const signupInfo = JSON.parse(localStorage.getItem("signup_info") || "null");
        setUserInfo(signupInfo && Object.keys(signupInfo).length > 0 ? signupInfo : null);
      }
      setLoading(false);
    };

    if (isAuthenticated) {
      fetchUserInfo();
    } else {
      setUserInfo(null);
      setLoading(false);
    }
  }, [isAuthenticated]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto mt-10 p-8 bg-white shadow-md rounded-lg">
        <h2 className="text-3xl font-extrabold mb-8 text-center tracking-wide">MY PROFILE</h2>
        {loading ? (
          <p className="text-center text-lg text-gray-500 py-10">Loading user information...</p>
        ) : userInfo ? (
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* User Image Section */}
            <div className="flex flex-col items-center mb-6 md:mb-0">
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mb-4 border-4 border-purple-500">
                {imagePreview ? (
                  <img src={imagePreview} alt="User" className="object-cover w-full h-full" />
                ) : userInfo.image ? (
                  <img src={userInfo.image} alt="User" className="object-cover w-full h-full" />
                ) : (
                  <span className="text-6xl text-gray-400">👤</span>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-purple-50 file:text-purple-700
                  hover:file:bg-purple-100"
                onChange={handleImageChange}
              />
              <span className="text-xs text-gray-400 mt-1">(Profile image preview only)</span>
            </div>
            {/* User Info Section */}
            <div className="flex-1 space-y-6">
              <div>
                <p className="text-lg font-semibold text-gray-700 mb-1">Name</p>
                <p className="text-xl text-gray-900 tracking-wide">
                  {userInfo.name || userInfo.username || userInfo.full_name || ""}
                </p>
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-700 mb-1">Gender</p>
                <p className="text-xl text-gray-900 tracking-wide">{userInfo.gender || ""}</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-700 mb-1">Email</p>
                <p className="text-xl text-gray-900 tracking-wide">{userInfo.email || ""}</p>
              </div>
              {userInfo.post_count && (
                <div>
                  <p className="text-lg font-semibold text-gray-700 mb-1">Post Count</p>
                  <p className="text-xl text-gray-900 tracking-wide">{userInfo.post_count}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="text-center text-lg text-gray-500 py-10">No user information found.</p>
        )}
      </div>
    </>
  );
};

export default User;