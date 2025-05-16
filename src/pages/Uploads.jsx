import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const Uploads = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Replace this with your real API endpoint
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://otaku-hub-api.vercel.app/api/blogs/${id}`);
        if (!response.ok) throw new Error("Blog not found");
        const data = await response.json();
        setBlog(data);
      } catch (err) {
        setBlog(null);
      }
      setLoading(false);
    };
    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <span className="text-xl text-gray-600">Loading blog...</span>
        </div>
      </>
    );
  }

  if (!blog) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <span className="text-xl text-red-600">Blog not found.</span>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto mt-10 p-8 bg-white shadow-md rounded-lg">
        <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
        <div className="mb-2 text-gray-500 text-sm">
          By {blog.author} • {new Date(blog.created_at).toLocaleDateString()}
        </div>
        {blog.image && (
          <img src={blog.image} alt={blog.title} className="w-full rounded-lg mb-6" />
        )}
        <div className="mb-6 text-lg text-gray-800">{blog.content}</div>
        <div className="mb-4 font-semibold text-purple-700">
          Comments ({blog.comments?.length || 0})
        </div>
        <div className="space-y-4">
          {blog.comments && blog.comments.length > 0 ? (
            blog.comments.map((comment, idx) => (
              <div key={idx} className="bg-gray-100 p-3 rounded">
                <div className="font-semibold text-gray-700">{comment.user}</div>
                <div className="text-gray-800">{comment.text}</div>
                <div className="text-xs text-gray-400">{new Date(comment.date).toLocaleString()}</div>
              </div>
            ))
          ) : (
            <div className="text-gray-500">No comments yet.</div>
          )}
        </div>
        <Link to={`/uploads/${blog.id}`}>
          {/* Blog card content */}
        </Link>
      </div>
    </>
  );
};

export default Uploads;
