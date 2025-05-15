import React, { useState } from "react";
import Navbar from "../components/Navbar";

const Blog = () => {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);

  const handleLike = () => setLikes((prevLikes) => (prevLikes === 0 ? 1 : 0));
  const handleDislike = () =>
    setDislikes((prevDislikes) => (prevDislikes === 0 ? 1 : 0));

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6">Featured Posts</h2>
        <div className="flex flex-col md:flex-row bg-white shadow-md rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-105">
          <img
            src="Aot.webp"
            alt="Featured Post"
            className="w-full md:w-1/3 object-cover transform transition-transform duration-300 hover:scale-110"
          />
          <div className="p-6 flex flex-col justify-between">
            <div>
              <span className="text-purple-700 font-semibold text-sm">Review</span>
              <h3 className="text-xl font-bold mt-2">
                Attack on Titan Final Season: A Perfect Conclusion?
              </h3>
              <p className="text-gray-600 mt-2">
                The epic saga comes to a close. We review the final season and its
                impact on the anime community.
              </p>
            </div>
            <div className="flex space-x-4 mt-4">
              <button
                onClick={handleLike}
                className={`px-4 py-2 rounded-md ${
                  likes > 0
                    ? "bg-green-600 text-white"
                    : "bg-green-500 text-white hover:bg-green-600"
                }`}
              >
                Like ({likes})
              </button>
              <button
                onClick={handleDislike}
                className={`px-4 py-2 rounded-md ${
                  dislikes > 0
                    ? "bg-red-600 text-white"
                    : "bg-red-500 text-white hover:bg-red-600"
                }`}
              >
                Dislike ({dislikes})
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Blog;