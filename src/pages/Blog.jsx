import React, { useEffect, useState, useContext } from 'react';
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Post from './Post';
import { AuthContext } from "../context/AuthContext";

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [comments, setComments] = useState({}); // { [postId]: [comment, ...] }
  const [commentInputs, setCommentInputs] = useState({}); // { [postId]: "" }
  const { isAuthenticated } = useContext(AuthContext);
  const userEmail = localStorage.getItem("user_email");

  useEffect(() => {
    // Fetch all posts from backend
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("auth_token");
        const res = await fetch("https://otaku-hub-api.vercel.app/api/post/", {
          headers: token ? { Authorization: `Token ${token}` } : {},
        });
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data = await res.json();
        setPosts(data);
      } catch (e) {
        setPosts([]);
      }
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const handleCommentInput = (postId, value) => {
    setCommentInputs((prev) => ({ ...prev, [postId]: value }));
  };

  const handleAddComment = (postId) => {
    const comment = (commentInputs[postId] || "").trim();
    if (!comment) return;
    setComments((prev) => ({
      ...prev,
      [postId]: prev[postId] ? [...prev[postId], comment] : [comment],
    }));
    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
  };

  const handleDeletePost = (postId) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    setComments((prev) => {
      const newComments = { ...prev };
      delete newComments[postId];
      return newComments;
    });
  };

  const handleLike = (postId) => {
    setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, likes: (p.likes || 0) + 1 } : p));
  };

  const handleDislike = (postId) => {
    setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, dislikes: (p.dislikes || 0) + 1 } : p));
  };

  // Filter posts uploaded by the current user
  const userPosts = userEmail
    ? posts.filter((p) => (p.author && (p.author === userEmail || p.author === userEmail.split('@')[0])))
    : [];
  const otherPosts = userEmail
    ? posts.filter((p) => !(p.author && (p.author === userEmail || p.author === userEmail.split('@')[0])))
    : posts;

  return (
    <>
      <Navbar />
      {/* Search Bar */}
      <div className="max-w-3xl mx-auto mt-6 mb-4 px-4">
        <input
          type="text"
          placeholder="Search blogs..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      {/* Floating "+" Icon (optional, can trigger navigation or modal) */}
      <motion.button
        onClick={() => setShowForm(true)}
        className="fixed bottom-8 right-8 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg text-4xl"
        title="Create Blog"
        aria-label="Create Blog"
        initial={{ scale: 0, opacity: 0, y: 100 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        whileHover={{ scale: 1.15, rotate: 360 }}
        whileTap={{ scale: 0.95, rotate: -10 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        +
      </motion.button>
      {showForm && (
        <Post setShowForm={setShowForm} showForm={showForm} />
      )}
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6">Blogs</h2>
        {loading ? (
          <div className="text-center text-lg text-gray-500 py-10">Loading blogs...</div>
        ) : (
          <div className="space-y-6">
            {/* User's own posts section */}
            {isAuthenticated && userPosts.length > 0 && (
              <div className="mb-10">
                <h3 className="text-2xl font-semibold mb-4 text-purple-700">Your Uploaded Blogs</h3>
                <div className="space-y-6">
                  {userPosts
                    .filter(content =>
                      (content.title && content.title.toLowerCase().includes(search.toLowerCase())) ||
                      (content.content && content.content.toLowerCase().includes(search.toLowerCase()))
                    )
                    .map((content, index) => (
                      <div
                        key={content.id || index}
                        className="flex flex-col md:flex-row bg-purple-50 shadow-md rounded-lg overflow-hidden border border-purple-200 transform transition-transform duration-300 hover:scale-105"
                      >
                        {content.image && (
                          <Link
                            to={`/uploads/${content.id}`}
                            className="w-full md:w-1/3 block"
                            style={{ minWidth: 0 }}
                          >
                            <img
                              src={content.image}
                              alt="Uploaded"
                              className="object-cover w-full h-full overflow-hidden"
                              style={{ pointerEvents: "none" }}
                            />
                          </Link>
                        )}
                        <div className="p-6 flex flex-col justify-between w-full">
                          <div className="flex justify-between items-start">
                            <Link
                              to={`/uploads/${content.id}`}
                              className="flex-1"
                              style={{ minWidth: 0 }}
                            >
                              {content.title && (
                                <h3 className="text-xl font-bold mb-2">{content.title}</h3>
                              )}
                              {content.content && (
                                <p className="text-gray-600 mb-4">{content.content}</p>
                              )}
                            </Link>
                            <button onClick={() => handleDeletePost(content.id)} className="text-red-500 hover:text-red-700 text-xl">🗑️</button>
                          </div>
                          <div className="flex flex-col md:flex-row md:items-center md:space-x-8 space-y-4 md:space-y-0">
                            <div className="flex space-x-6 items-center">
                              <button onClick={() => handleLike(content.id)} className="flex items-center text-2xl text-green-600 hover:text-green-800">
                                👍 <span className="ml-1 text-base">{content.likes || 0}</span>
                              </button>
                              <button onClick={() => handleDislike(content.id)} className="flex items-center text-2xl text-red-600 hover:text-red-800">
                                👎 <span className="ml-1 text-base">{content.dislikes || 0}</span>
                              </button>
                            </div>
                            <div className="flex items-center text-gray-500 text-sm font-semibold">
                              <span role="img" aria-label="comments">💬</span>
                              <span className="ml-1">Comments: 0</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 mt-4">
                            <input
                              type="text"
                              placeholder="Add a comment..."
                              className="border border-gray-300 rounded-md px-3 py-1 w-full"
                              disabled
                            />
                            <button
                              className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700"
                              disabled
                            >
                              Comment
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
            {/* All other posts */}
            {otherPosts.length > 0 ? (
              otherPosts
                .filter(content =>
                  (content.title && content.title.toLowerCase().includes(search.toLowerCase())) ||
                  (content.content && content.content.toLowerCase().includes(search.toLowerCase()))
                )
                .map((content, index) => (
                  <div
                    key={content.id || index}
                    className="flex flex-col md:flex-row bg-white shadow-md rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-105"
                  >
                    {content.image && (
                      <Link
                        to={`/uploads/${content.id}`}
                        className="w-full md:w-1/3 block"
                        style={{ minWidth: 0 }}
                      >
                        <img
                          src={content.image}
                          alt="Uploaded"
                          className="object-cover w-full h-full overflow-hidden transform transition-transform duration-300 hover:scale-10"
                          style={{ pointerEvents: "none" }}
                        />
                      </Link>
                    )}
                    <div className="p-6 flex flex-col justify-between w-full">
                      <div className="flex justify-between items-start">
                        <Link
                          to={`/uploads/${content.id}`}
                          className="flex-1"
                          style={{ minWidth: 0 }}
                        >
                          {content.title && (
                            <h3 className="text-xl font-bold mb-2">{content.title}</h3>
                          )}
                          {content.content && (
                            <p className="text-gray-600 mb-4">{content.content}</p>
                          )}
                        </Link>
                        <button onClick={() => handleDeletePost(content.id)} className="text-red-500 hover:text-red-700 text-xl">🗑️</button>
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center md:space-x-8 space-y-4 md:space-y-0">
                        <div className="flex space-x-6 items-center">
                          <button onClick={() => handleLike(content.id)} className="flex items-center text-2xl text-green-600 hover:text-green-800">
                            👍 <span className="ml-1 text-base">{content.likes || 0}</span>
                          </button>
                          <button onClick={() => handleDislike(content.id)} className="flex items-center text-2xl text-red-600 hover:text-red-800">
                            👎 <span className="ml-1 text-base">{content.dislikes || 0}</span>
                          </button>
                        </div>
                        <div className="flex items-center text-gray-500 text-sm font-semibold">
                          <span role="img" aria-label="comments">💬</span>
                          <span className="ml-1">Comments: 0</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mt-4">
                        <input
                          type="text"
                          placeholder="Add a comment..."
                          className="border border-gray-300 rounded-md px-3 py-1 w-full"
                          disabled
                        />
                        <button
                          className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700"
                          disabled
                        >
                          Comment
                        </button>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <p className="text-center text-lg text-gray-500 py-10">No blogs uploaded yet.</p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Blog;