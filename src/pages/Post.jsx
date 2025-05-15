import React, { useState } from 'react';

const Post = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [writeUp, setWriteUp] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleUpload = () => {
    if (title || image || writeUp) {
      const newContent = { title, image, writeUp, likes: 0, dislikes: 0 };
      // Save to localStorage for Blog.jsx to consume
      const prevContent = JSON.parse(localStorage.getItem("uploadedContent") || "[]");
      localStorage.setItem("uploadedContent", JSON.stringify([...prevContent, newContent]));
      setTitle("");
      setImage(null);
      setWriteUp("");
      alert("Blog uploaded! Go to the Blogs page to view it.");
    } else {
      alert("Please fill in at least one field before uploading.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Create Your Blog</h2>
      <div className="space-y-6">
        {/* Blog Title Input */}
        <div className="bg-white shadow-md rounded-lg p-6">
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

        {/* Blog Image Input */}
        <div className="bg-white shadow-md rounded-lg p-6">
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

        {/* Blog Write-up Input */}
        <div className="bg-white shadow-md rounded-lg p-6">
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

        {/* Upload Button */}
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
  );
};

export default Post;