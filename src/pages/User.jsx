import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const User = () => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    
    const fetchUserInfo = async () => {
      
      const userData = {
        username: "otaku_user",
        email: "otaku@example.com",
        joined: "2023-01-01",
      };
      setUserInfo(userData);
    };

    fetchUserInfo();
  }, []);

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-4">User Information</h2>
        {userInfo ? (
          <div>
            <p>
              <strong>Username:</strong> {userInfo.username}
            </p>
            <p>
              <strong>Email:</strong> {userInfo.email}
            </p>
            <p>
              <strong>Joined:</strong> {userInfo.joined}
            </p>
          </div>
        ) : (
          <p>Loading user information...</p>
        )}
      </div>
    </>
  );
};

export default User;