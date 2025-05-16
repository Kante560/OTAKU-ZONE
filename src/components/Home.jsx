import Navbar from "./Navbar";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Home() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <>
      <Navbar />
      <div className="flex flex-col justify-center items-center relative w-full h-screen overflow-hidden bg-gradient-to-b from-purple-700 to-purple-900 text-white">
    
        <video
          className="absolute top-0 left-0 w-full h-full object-cover transform rotate-1800"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/Edit.mp4" type="video/mp4" />
        </video>


        <div className="absolute top-0 left-0 w-full h-full bg-black/40 backdrop-blur-sm z-10"></div>

        
        <div className="relative z-20 flex flex-col items-center justify-center h-full">
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-4">
            Discover & Explore the World of Anime
          </h1>
          <p className="text-center text-lg md:text-xl max-w-2xl mb-6">
            Join our community of anime enthusiasts. Get the latest reviews,
            news, and discussions about your favorite shows.
          </p>
          <div className="flex space-x-4">
            
            <button className="bg-white text-purple-700 font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-gray-200">
              Explore
            </button>
            {isAuthenticated && (
              <Link
                to="/user"
                className="bg-purple-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-purple-700 transition-colors"
              >
                My Profile
              </Link>
            )}
        
          </div>
        </div>
      </div>
    </>
  );
}
