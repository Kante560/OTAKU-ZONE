import React from "react";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white w-full justify-center overflow-x-hidden ">
      <motion.div
        initial={{ background: "linear-gradient(to left, #c084fc, #6d28d9)" }}
        animate={{
          background: [
            "linear-gradient(to right, #c084fc, #6d28d9)",
            "linear-gradient(to right, #a5b4fc, #a21caf)",
            "linear-gradient(to left, #6d28d9,#c084fc )",
          ],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "loop",
        }}
        className="bg-purple-700 text-center py-8"
        style={{ backgroundSize: "200% 200%" }}
      >
        <h2 className="text-2xl font-bold mb-2">Join Our Anime Community</h2>
        <p className="mb-4">
          Get exclusive content, participate in discussions, and stay updated
          with the latest in anime.
        </p>
        <div className="flex justify-center items-center space-x-2">
          <input
            type="email"
            placeholder="Your email address"
            className="py-2 px-4 rounded-lg text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button className="bg-white text-purple-700 font-semibold py-2 px-6 rounded-lg hover:bg-gray-200">
            Subscribe Now
          </button>
        </div>
      </motion.div>

      {/* Center all grid content */}
      <div className="max-w-7xl mx-auto py-8 px-6 flex flex-col items-center justify-center text-center">
        <div className="w-full grid ml-[430px] grid-cols-1 md:grid-cols-4 gap-10 overflow-hidden">
          <div>
            <h3 className="text-lg font-bold bg-gradient-to-r  gradient-purple-500 mb-2">
              OTAKU VERSE
            </h3>
            <p className="text-gray-400 text-sm">
              Your one-stop destination for all things anime. Reviews, news, and
              discussions for the passionate anime community.
            </p>
            <div className="flex justify-center space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-discord"></i>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-2">Subscribe</h3>
            <p className="text-gray-400 text-sm mb-4">
              Get the latest anime news and updates delivered to your inbox.
            </p>
            <div className="flex justify-center space-x-2">
              <input
                type="email"
                placeholder="Your email"
                className="py-2 px-4 rounded-lg text-gray-700 border border-gray-300"
              />
              <button className="bg-purple-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-white hover:text-purple-500">
                Join
              </button>
            </div>
          </div>
          {/* ...add other columns here if needed... */}
        </div>
      </div>
      <div className="bg-gray-800 text-center py-4 text-gray-500 text-sm">
        <p>&copy; 2025 OTAKUVERSE. All rights reserved.</p>
        <p>Made with ❤️ for anime fans</p>
      </div>
    </footer>
  );
};

export default Footer;
