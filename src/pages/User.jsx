import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const User = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const userData = {
        username: "otaku_user",
        email: "otaku@example.com",
        joined: "2023-01-01",
        // image: undefined // No image by default
      };
      setUserInfo(userData);
    };

    fetchUserInfo();
  }, []);

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
        {userInfo ? (
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* User Image Section */}
            <div className="flex flex-col items-center mb-6 md:mb-0">
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mb-4 border-4 border-purple-500">
                {/* Show preview if selected, else user's image, else placeholder */}
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
                <p className="text-lg font-semibold text-gray-700 mb-1">Username</p>
                <p className="text-xl text-gray-900 tracking-wide">{userInfo.username}</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-700 mb-1">Email</p>
                <p className="text-xl text-gray-900 tracking-wide">{userInfo.email}</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-700 mb-1">Joined</p>
                <p className="text-xl text-gray-900 tracking-wide">{userInfo.joined}</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-lg text-gray-500 py-10">Loading user information...</p>
        )}
      </div>
    </>
  );
};

export default User;