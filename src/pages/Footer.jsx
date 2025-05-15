import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white w-full justify-center ">
     
      <div className="bg-purple-700 text-center py-8">
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
      </div>

      <div className="max-w-7xl mr-15 mx-auto py-8 px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <h3 className="text-lg font-bold bg-gradient-to-r  gradient-purple-500 mb-2">OTAKU VERSE</h3>
          <p className="text-gray-400 text-sm">
            Your one-stop destination for all things anime. Reviews, news, and
            discussions for the passionate anime community.
          </p>
          <div className="flex space-x-4 mt-4">
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
          <h3 className="text-lg font-bold mb-2">Quick Links</h3>
          <ul className="text-gray-400 text-sm space-y-2">
            <li><a href="#" className="hover:text-white">Home</a></li>
            <li><a href="#" className="hover:text-white">About Us</a></li>
            <li><a href="#" className="hover:text-white">Reviews</a></li>
            <li><a href="#" className="hover:text-white">News</a></li>
            <li><a href="#" className="hover:text-white">Contact</a></li>
          </ul>
        </div>
        
       
        <div>
          <h3 className="text-lg font-bold mb-2">Subscribe</h3>
          <p className="text-gray-400 text-sm mb-4">
            Get the latest anime news and updates delivered to your inbox.
          </p>
          <div className="flex space-x-2">
            <input
              type="email"
              placeholder="Your email"
              className="py-2 px-4 rounded-lg text-gray-700 border border-gray-300"
            />
            <button className="bg-purple-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600">
              Join
            </button>
          </div>
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