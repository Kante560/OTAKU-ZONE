import React, { useState, useEffect } from 'react';

const Post = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [writeUp, setWriteUp] = useState("");
  const [uploadedContent, setUploadedContent] = useState(() => {
    const savedContent = localStorage.getItem("uploadedContent");
    return savedContent ? JSON.parse(savedContent) : [];
  });

  useEffect(() => {
    localStorage.setItem("uploadedContent", JSON.stringify(uploadedContent));
  }, [uploadedContent]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleUpload = () => {
    if (title || image || writeUp) {
      const newContent = { title, image, writeUp, likes: 0, dislikes: 0 };
      setUploadedContent((prevContent) => [...prevContent, newContent]);
      setTitle("");
      setImage(null);
      setWriteUp("");
    } else {
      alert("Please fill in at least one field before uploading.");
    }
  };

  const handleLike = (index) => {
    setUploadedContent((prevContent) =>
      prevContent.map((content, i) =>
        i === index
          ? { ...content, likes: content.likes === 0 ? 1 : 0 }
          : content
      )
    );
  };

  const handleDislike = (index) => {
    setUploadedContent((prevContent) =>
      prevContent.map((content, i) =>
        i === index
          ? { ...content, dislikes: content.dislikes === 0 ? 1 : 0 }
          : content
      )
    );
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

        {/* Display Uploaded Content */}
        {uploadedContent.length > 0 && (
          <div className="space-y-6">
            {uploadedContent.map((content, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row bg-white shadow-md rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-105"
              >
                {content.image && (
                  <img
                    src={content.image}
                    alt="Uploaded"
                    className="w-full md:w-1/3 object-cover transform transition-transform duration-300 hover:scale-110"
                  />
                )}
                <div className="p-6 flex flex-col justify-between">
                  {content.title && (
                    <h3 className="text-xl font-bold mb-2">{content.title}</h3>
                  )}
                  {content.writeUp && (
                    <p className="text-gray-600 mb-4">{content.writeUp}</p>
                  )}
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleLike(index)}
                      className={`px-4 py-2 rounded-md ${
                        content.likes > 0
                          ? "bg-green-600 text-white"
                          : "bg-green-500 text-white hover:bg-green-600"
                      }`}
                    >
                      Like ({content.likes})
                    </button>
                    <button
                      onClick={() => handleDislike(index)}
                      className={`px-4 py-2 rounded-md ${
                        content.dislikes > 0
                          ? "bg-red-600 text-white"
                          : "bg-red-500 text-white hover:bg-red-600"
                      }`}
                    >
                      Dislike ({content.dislikes})
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Post;