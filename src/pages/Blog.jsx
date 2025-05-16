import React, { useEffect, useState } from 'react';
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";

const Blog = () => {
  const [uploadedContent, setUploadedContent] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  // Form state (copied from Post.jsx)
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [writeUp, setWriteUp] = useState("");
  const [comments, setComments] = useState({}); // { [index]: [comment, ...] }
  const [commentInputs, setCommentInputs] = useState({}); // { [index]: "" }

  useEffect(() => {
    const savedContent = localStorage.getItem("uploadedContent");
    setUploadedContent(savedContent ? JSON.parse(savedContent) : []);
    const savedComments = localStorage.getItem("blogComments");
    setComments(savedComments ? JSON.parse(savedComments) : {});
  }, []);

  const handleLike = (index) => {
    setUploadedContent((prevContent) => {
      const updated = prevContent.map((content, i) => {
        if (i === index) {
          // If already liked, remove like. If disliked, remove dislike and add like.
          if (content.likes === 1) {
            return { ...content, likes: 0, dislikes: 0 };
          } else {
            return { ...content, likes: 1, dislikes: 0 };
          }
        }
        return content;
      });
      localStorage.setItem("uploadedContent", JSON.stringify(updated));
      return updated;
    });
  };

  const handleDislike = (index) => {
    setUploadedContent((prevContent) => {
      const updated = prevContent.map((content, i) => {
        if (i === index) {
          // If already disliked, remove dislike. If liked, remove like and add dislike.
          if (content.dislikes === 1) {
            return { ...content, dislikes: 0, likes: 0 };
          } else {
            return { ...content, dislikes: 1, likes: 0 };
          }
        }
        return content;
      });
      localStorage.setItem("uploadedContent", JSON.stringify(updated));
      return updated;
    });
  };

  // Delete post
  const handleDeletePost = (index) => {
    setUploadedContent((prevContent) => {
      const updated = prevContent.filter((_, i) => i !== index);
      localStorage.setItem("uploadedContent", JSON.stringify(updated));
      // Remove comments for this post
      setComments((prevComments) => {
        const newComments = { ...prevComments };
        delete newComments[index];
        // Shift comments for posts after the deleted one
        const shiftedComments = {};
        Object.keys(newComments).forEach((key) => {
          const k = parseInt(key, 10);
          shiftedComments[k > index ? k - 1 : k] = newComments[key];
        });
        localStorage.setItem("blogComments", JSON.stringify(shiftedComments));
        return shiftedComments;
      });
      return updated;
    });
  };

  // Form logic
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleUpload = () => {
    if (title || image || writeUp) {
      const newContent = { title, image, writeUp, likes: 0, dislikes: 0 };
      const prevContent = JSON.parse(localStorage.getItem("uploadedContent") || "[]");
      const updatedContent = [...prevContent, newContent];
      localStorage.setItem("uploadedContent", JSON.stringify(updatedContent));
      setUploadedContent(updatedContent);
      setTitle("");
      setImage(null);
      setWriteUp("");
      setShowForm(false);
    } else {
      alert("Please fill in at least one field before uploading.");
    }
  };

  // Comment logic
  const handleCommentInput = (index, value) => {
    setCommentInputs((prev) => ({ ...prev, [index]: value }));
  };

  const handleAddComment = (index) => {
    const comment = (commentInputs[index] || "").trim();
    if (!comment) return;
    setComments((prev) => {
      const updated = {
        ...prev,
        [index]: prev[index] ? [...prev[index], comment] : [comment],
      };
      localStorage.setItem("blogComments", JSON.stringify(updated));
      return updated;
    });
    setCommentInputs((prev) => ({ ...prev, [index]: "" }));
  };

  // Delete comment
  const handleDeleteComment = (postIndex, commentIndex) => {
    setComments((prev) => {
      const postComments = prev[postIndex] || [];
      const updatedComments = postComments.filter((_, i) => i !== commentIndex);
      const updated = { ...prev, [postIndex]: updatedComments };
      localStorage.setItem("blogComments", JSON.stringify(updated));
      return updated;
    });
  };

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

      {/* Floating "+" Icon */}
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-8 right-8 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg text-4xl"
        title="Create Blog"
        aria-label="Create Blog"
      >
        +
      </button>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-8 relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-6">Create Your Blog</h2>
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-0">
                <label htmlFor="title" className="block text-lg font-semibold mb-2">
                  Blog Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="Enter your blog title"
                />
              </div>
              <div className="bg-white rounded-lg p-0">
                <label htmlFor="image" className="block text-lg font-semibold mb-2">
                  Upload Image
                </label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
                {image && (
                  <div className="mt-4">
                    <img
                      src={image}
                      alt="Uploaded"
                      className="w-full h-64 object-cover rounded-md"
                    />
                  </div>
                )}
              </div>
              <div className="bg-white rounded-lg p-0">
                <label htmlFor="writeUp" className="block text-lg font-semibold mb-2">
                  Write-up
                </label>
                <textarea
                  id="writeUp"
                  value={writeUp}
                  onChange={(e) => setWriteUp(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2"
                  rows="5"
                  placeholder="Write your blog content here"
                ></textarea>
              </div>
              <div className="text-center">
                <button
                  onClick={handleUpload}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Upload Blog
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6">Blogs</h2>
        {/* Revert to vertical stack, not grid */}
        <div className="space-y-6">
          {uploadedContent.filter(content =>
            (content.title && content.title.toLowerCase().includes(search.toLowerCase())) ||
            (content.writeUp && content.writeUp.toLowerCase().includes(search.toLowerCase()))
          ).length > 0 ? (
            uploadedContent
              .map((content, index) => ({ content, index }))
              .filter(({ content }) =>
                (content.title && content.title.toLowerCase().includes(search.toLowerCase())) ||
                (content.writeUp && content.writeUp.toLowerCase().includes(search.toLowerCase()))
              )
              .map(({ content, index }) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row bg-white shadow-md rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-105"
                >
                  {content.image && (
                    <Link
                      to={`/uploads/${index}`}
                      className="w-full md:w-1/3 block"
                      style={{ minWidth: 0 }}
                    >
                      <img
                        src={content.image}
                        alt="Uploaded"
                        className="object-cover w-full h-full transition-transform duration-300 ease-in-out hover:scale-110"
                        style={{ pointerEvents: "none" }}
                      />
                    </Link>
                  )}
                  <div className="p-6 flex flex-col justify-between w-full">
                    <div className="flex justify-between items-start">
                      <Link
                        to={`/uploads/${index}`}
                        className="flex-1"
                        style={{ minWidth: 0 }}
                      >
                        {content.title && (
                          <h3 className="text-xl font-bold mb-2">{content.title}</h3>
                        )}
                        {content.writeUp && (
                          <p className="text-gray-600 mb-4">{content.writeUp}</p>
                        )}
                      </Link>
                      <button
                        onClick={() => handleDeletePost(index)}
                        className="ml-4 text-red-500 hover:text-red-700 text-2xl"
                        title="Delete Post"
                      >
                        🗑️
                      </button>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center md:space-x-8 space-y-4 md:space-y-0">
                      {/* Like/Dislike/Comment Section */}
                      <div className="flex space-x-6 items-center">
                        <button
                          onClick={() => handleLike(index)}
                          className={`flex items-center text-2xl ${
                            content.likes > 0
                              ? "text-green-600"
                              : "text-gray-400 hover:text-green-500"
                          }`}
                          title="Like"
                        >
                          <span role="img" aria-label="like">👍</span>
                          <span className="ml-2 text-base">{content.likes}</span>
                        </button>
                        <button
                          onClick={() => handleDislike(index)}
                          className={`flex items-center text-2xl ${
                            content.dislikes > 0
                              ? "text-red-600"
                              : "text-gray-400 hover:text-red-500"
                          }`}
                          title="Dislike"
                        >
                          <span role="img" aria-label="dislike">👎</span>
                          <span className="ml-2 text-base">{content.dislikes}</span>
                        </button>
                      </div>
                      {/* Comment Section */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            placeholder="Add a comment..."
                            value={commentInputs[index] || ""}
                            onChange={e => handleCommentInput(index, e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-1 w-full"
                          />
                          <button
                            onClick={() => handleAddComment(index)}
                            className="bg-purple-600 text-white px-3 py-1 rounded-md hover:bg-purple-700"
                          >
                            Comment
                          </button>
                        </div>
                        <div className="mt-2 space-y-1">
                          {(comments[index] || []).map((c, i) => (
                            <div key={i} className="flex items-center text-sm text-gray-700 bg-gray-100 rounded px-2 py-1">
                              <span className="flex-1">{c}</span>
                              <button
                                onClick={() => handleDeleteComment(index, i)}
                                className="ml-2 text-xs text-red-400 hover:text-red-700"
                                title="Delete Comment"
                              >
                                ❌
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <p className="text-center text-lg text-gray-500 py-10">No blogs uploaded yet.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Blog;