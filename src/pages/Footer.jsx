import React from "react";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-black via-purple-900 to-red-900 text-white w-full justify-center overflow-x-hidden ">
      <motion.div
        initial={{ background: "linear-gradient(to left, #6d28d9, #c084fc)" }}
        animate={{
          background: [
            "linear-gradient(to right, #6d28d9, #c084fc)",
            "linear-gradient(to right, #a21caf, #ef4444)",
            "linear-gradient(to left, #6d28d9,#c084fc )",
          ],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "loop",
        }}
        className="bg-gradient-to-r from-purple-900 via-black to-red-900 text-center py-8"
        style={{ backgroundSize: "200% 200%" }}
      >
        <h2 className="text-2xl font-bold mb-2 text-white">
          Join Our Anime Community
        </h2>
        <p className="mb-4 sm:max-w-[300px] md:max-w-7xl text-center mx-auto text-purple-200">
          Get exclusive content, participate in discussions, and stay updated
          with the latest in anime.
        </p>
      </motion.div>
      <div className="max-w-7xl mx-auto py-8 px-6 flex flex-col items-center justify-center text-center">
        <div className="w-full flex text-center justify-center flex-col  max-w-[600px] gap-10 overflow-hidden">
          <div>
            <h3 className="text-lg font-bold mb-2 text-white"> OTAKU VERSE</h3>
            <p className="text-purple-200 text-sm">
              Your one-stop destination for all things anime. Reviews, news, and
              discussions for the passionate anime community.
            </p>
            <div className="flex justify-center space-x-4 mt-4">
              <a href="#" className="text-purple-300 hover:text-white">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-purple-300 hover:text-white">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-purple-300 hover:text-white">
                <i className="fab fa-discord"></i>
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2 text-white">Subscribe</h3>
              <span className="text-purple-200 text-sm sm:text-center sm:flex sm:justify-center mb-4 block">
                Get the latest anime news and updates delivered to your inbox.
              </span>
            <div className="flex justify-center space-x-2">
              <input
                type="email"
                placeholder="Your email"
                className="py-2 px-4 rounded-lg text-gray-700 border border-gray-300"
              />
              <button 
                onClick={() => alert('subscribed')}
                className="bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 hover:text-white">
                Join
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-black text-center py-4 text-purple-300 text-sm">
        <p>&copy; 2025 OTAKUVERSE. All rights reserved.</p>
        <p>Made with ❤️ for anime fans</p>
      </div>
    </footer>
  );
};

export default Footer;
