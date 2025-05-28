import Navbar from "./Navbar";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import Signup from "../pages/Signup";
import Login from "../pages/Login";
import { useState } from "react";

export default function Home() {
  const { isAuthenticated } = useContext(AuthContext);
  const [showSignup, setShowSignup] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <Navbar />
      <div className="flex flex-col justify-center items-center relative w-full h-screen overflow-hidden bg-gradient-to-b from-purple-900 via-black to-red-900 text-white">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover opacity-60"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/Edit.mp4" type="video/mp4" />
        </video>
        <div className="absolute top-0 left-0 w-full h-full bg-black/70 backdrop-blur-sm z-10"></div>
        <div className="relative z-20 flex flex-col items-center sm:max-w-[600px] justify-center h-full">
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-4 sm:max-w-[300px] md:max-w-7xl text-white drop-shadow-lg">
            Discover & Explore the World of Anime
          </h1>
          <p className="text-center text-lg md:text-xl sm:max-w-[300px] md:max-w-7xl mb-6 text-purple-200">
            Join our community of anime enthusiasts. Get the latest reviews,
            news, and discussions about your favorite shows.
          </p>
          <div className="flex space-x-4">
            {isAuthenticated ? (
              <Link
                to="/blog"
                className="bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-purple-800 transition-colors"
                onClick={() => setShowSignup(false)}
              >
                Explore
             </Link>

             
            ) : (
              <>
                <button
                  className="bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-purple-600"
                  onClick={() => setShowSignup(true)}
                >
                  Signup
                </button>
                <button
                  className="bg-red-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-red-500 transition-colors"
                  onClick={() => setShowLogin(true)}
                >
                  Login
                </button>
              </>
            )}
            {isAuthenticated && (
              <Link
                to="/user"
                className="bg-purple-900 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-purple-700 transition-colors"
              >
                My Profile
              </Link>
            )}
          </div>
        </div>
        {showSignup && <Signup setShowSignup={setShowSignup} showSignup={showSignup} />}
        {showLogin && <Login setShowLogin={setShowLogin} showLogin={showLogin} />}
      </div>
    </>
  );
}
