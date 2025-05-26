import React, { useState, useEffect } from 'react';

const Post = ({ setShowForm, showForm }) => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null); // This will be the backend URL
  const [writeUp, setWriteUp] = useState("");
  const [imageFile, setImageFile] = useState(null); // Store the file for upload
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);

  // Get current user email for ownership check
  const userEmail = localStorage.getItem("user_email");

  // Handle image selection and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const preview = URL.createObjectURL(file);
      setImage(preview);
    }
  };

  // Upload blog post to backend
  const sendPost = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", writeUp); // changed from writeUp to content
      if (imageFile) {
        formData.append("file", imageFile);
      }
      const res = await fetch("https://otaku-hub-api.vercel.app/api/post/", {
        method: "POST",
        headers: {
          Authorization: `Token ${localStorage.getItem("auth_token")}`,
        },
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err?.error || err?.message || "Failed to post blog");
        setLoading(false);
        return;
      }
      setTitle("");
      setImage(null);
      setImageFile(null);
      setWriteUp("");
      setShowForm(false);
      setLoading(false);
      alert("Blog uploaded!");
    } catch (e) {
      alert("Failed to post blog");
      setLoading(false);
    }
  };

  // Delete a post
  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      const res = await fetch(`https://otaku-hub-api.vercel.app/api/post/${postId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Token ${localStorage.getItem("auth_token")}`,
        },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err?.error || err?.message || "Failed to delete post");
        return;
      }
      setPosts(posts.filter((post) => post.id !== postId));
      alert("Post deleted");
    } catch (e) {
      alert("Failed to delete post");
    }
  };

  useEffect(() => {
    // Fetch all posts from backend
    const fetchPosts = async () => {
      try {
        const res = await fetch("https://otaku-hub-api.vercel.app/api/post/");
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data = await res.json();
        setPosts(data);
      } catch (e) {
        setPosts([]);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg overflow-y-auto max-w-lg w-full p-8 relative" style={{ maxHeight: "90vh" }}>
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
              onClick={sendPost}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Uploading..." : "Upload Blog"}
            </button>
          </div>
        </div>
        {/* Show all uploaded posts below the form */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">All Uploaded Posts</h3>
          <div className="space-y-4 max-h-64 overflow-y-auto">
            {posts.length === 0 ? (
              <div className="text-gray-500">No posts yet.</div>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="border rounded p-3 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div className="font-bold text-lg">{post.title}</div>
                    {/* Fix: check for both author (email or username) and is_owner, and log for debug */}
                    {((post.author && (post.author === userEmail || post.author === userEmail.split('@')[0])) || post.is_owner) ? (
                      <button onClick={() => handleDeletePost(post.id)} className="text-red-500 hover:text-red-700 text-xl">🗑️</button>
                    ) : (
                      <span className="text-xs text-gray-400">{/* Debug: {post.author} | {userEmail} | {String(post.is_owner)} */}</span>
                    )}
                  </div>
                  {post.image && (
                    <img src={post.image} alt={post.title} className="w-full h-32 object-cover rounded my-2" />
                  )}
                  <div className="text-gray-700">{post.content}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;