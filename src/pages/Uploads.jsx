import React, { useContext, useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";

const Uploads = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editImage, setEditImage] = useState(null);
  const [editImageFile, setEditImageFile] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      const res = await fetch(
        `https://otaku-hub-api.vercel.app/api/post/${id}/`, // <-- fixed trailing slash
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );
      if (res.status === 401) {
        logout();
        navigate("/login");
        return;
      }
      if (!res.ok) {
        setBlog(null);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setBlog(data);
      setEditTitle(data.title || "");
      setEditContent(data.content || "");
      setEditImage(data.image || null);
      setLoading(false);
    };
    fetchBlog();
  }, [id, token, logout, navigate]);

  // Fetch comments for this blog post
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(
          `https://otaku-hub-api.vercel.app/api/posts/${id}/comments/`,
          {
            headers: token ? { Authorization: `Token ${token}` } : {},
          }
        );
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        } else {
          setComments([]);
        }
      } catch {
        setComments([]);
      }
    };
    fetchComments();
  }, [id, token]);

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditImageFile(file);
      setEditImage(URL.createObjectURL(file));
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    let imageUrl = blog.image;
    // If a new image is selected, upload it first
    if (editImageFile) {
      const formData = new FormData();
      formData.append("image", editImageFile);
      const imgRes = await fetch(
        `https://otaku-hub-api.vercel.app/api/post/${id}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Token ${token}`,
          },
          body: formData,
        }
      );
      if (imgRes.ok) {
        const imgData = await imgRes.json();
        imageUrl = imgData.image_url || imageUrl;
      }
    }
    // Update the post
    const res = await fetch(
      `https://otaku-hub-api.vercel.app/api/post/${id}/`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          title: editTitle,
          content: editContent,
          image: imageUrl,
        }),
      }
    );
    if (res.ok) {
      const updated = await res.json();
      setBlog(updated);
      setEditing(false);
      setEditImageFile(null);
      alert("Post updated!");
    } else {
      alert("Failed to update post");
    }
    setEditLoading(false);
  };

  // Delete post handler
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      const res = await fetch(`https://otaku-hub-api.vercel.app/api/post/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      if (res.status === 401) {
        logout();
        navigate("/login");
        return;
      }
      if (res.status === 204) {
        alert("Post deleted.");
        navigate("/blog");
      } else {
        alert("Failed to delete post.");
      }
    } catch (err) {
      alert("Network error. Could not delete post.");
    }
  };

  // Add comment handler
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    setCommentLoading(true);
    try {
      const res = await fetch(
        `https://otaku-hub-api.vercel.app/api/posts/${id}/comments/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({ content: commentInput.trim() }),
        }
      );
      if (res.ok) {
        const newComment = await res.json();
        setComments((prev) => [...prev, newComment]);
        setCommentInput("");
        alert("Comment sent!");
      } else {
        alert("Failed to post comment");
      }
    } catch {
      alert("Failed to post comment");
    }
    setCommentLoading(false);
  };

  // Like/dislike handlers with backend integration
  const handleLike = async () => {
    try {
      const res = await fetch(`https://otaku-hub-api.vercel.app/api/posts/${id}/like/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
      });
      if (res.ok) {
        // Refetch blog data
        const pres = await fetch(`https://otaku-hub-api.vercel.app/api/post/${id}/`);
        const postData = pres.ok ? await pres.json() : {};
        setBlog(postData);
      } else {
        alert('Failed to like post');
      }
    } catch {
      alert('Failed to like post');
    }
  };

  const handleDislike = async () => {
    try {
      const res = await fetch(`https://otaku-hub-api.vercel.app/api/posts/${id}/dislike/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
      });
      if (res.ok) {
        // Refetch blog data
        const pres = await fetch(`https://otaku-hub-api.vercel.app/api/post/${id}/`);
        const postData = pres.ok ? await pres.json() : {};
        setBlog(postData);
      } else {
        alert('Failed to dislike post');
      }
    } catch {
      alert('Failed to dislike post');
    }
  };

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
        {!editing ? (
          <>
            <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
            <div className="mb-2 text-gray-500 text-sm">
              By {blog.author} •{" "}
              {new Date(blog.created_at).toLocaleDateString()}
            </div>
            {blog.image && (
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full rounded-lg mb-6"
              />
            )}
            <div className="mb-6 text-lg block  overflow-x-hidden text-gray-800">{blog.content}</div>
            <div className="flex items-center gap-6 mb-4">
              <span className="font-semibold text-purple-700">
                Comments ({comments.length})
              </span>
              <span className="flex items-center text-green-600 font-semibold cursor-pointer" onClick={handleLike}>
                <span role="img" aria-label="like">👍</span> {blog.likes || 0}
              </span>
              <span className="flex items-center text-red-600 font-semibold cursor-pointer" onClick={handleDislike}>
                <span role="img" aria-label="dislike">👎</span> {blog.dislikes || 0}
              </span>
              {/* Show edit button if user is author */}
              {blog.is_owner && !editing && (
                <>
                  <button
                    className="ml-4 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={() => setEditing(true)}
                  >
                    Edit Post
                  </button>
                  <button
                    className="ml-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    onClick={handleDelete}
                  >
                    Delete Post
                  </button>
                </>
              )}
              {/* Edit form for user's own post */}
              {editing && blog.is_owner && (
                <form onSubmit={handleEditSubmit} className="space-y-6 mt-6 bg-gray-50 p-6 rounded-lg shadow">
                  <h2 className="text-2xl font-bold mb-4">Edit Post</h2>
                  <div>
                    <label className="block font-semibold mb-1">Title</label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2"
                      maxLength={50}
                      minLength={1}
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Content</label>
                    <textarea
                      value={editContent}
                      onChange={e => setEditContent(e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2"
                      rows="5"
                      minLength={1}
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleEditImageChange}
                    />
                    {editImage && (
                      <img
                        src={editImage}
                        alt="Preview"
                        className="w-full h-64 object-cover rounded-md mt-2"
                      />
                    )}
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      disabled={editLoading}
                    >
                      {editLoading ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                      onClick={() => setEditing(false)}
                      disabled={editLoading}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
            {/* Comments input and list */}
            <form onSubmit={handleCommentSubmit} className="flex gap-2 mb-4">
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                className="flex-1 px-3 py-1 rounded bg-gray-100 border border-purple-300 focus:outline-none"
                placeholder="Add a comment..."
                required
                disabled={commentLoading}
              />
              <button
                type="submit"
                className="bg-purple-700 text-white px-3 py-1 rounded hover:bg-purple-900"
                disabled={commentLoading}
              >
                {commentLoading ? "Sending..." : "Reply"}
              </button>
            </form>
            <div className="space-y-4">
              {comments.length > 0 ? (
                comments.map((comment, idx) => (
                  <div key={comment.id || idx} className="bg-gray-100 p-3 rounded">
                    <div className="font-semibold text-gray-700">
                      User {comment.owner}
                    </div>
                    <div className="text-gray-800">{comment.content}</div>
                    <div className="text-xs text-gray-400">
                      {comment.date_published ? new Date(comment.date_published).toLocaleString() : ''}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-500">No comments yet.</div>
              )}
            </div>
          </>
        ) : (
          <form onSubmit={handleEditSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">Edit Post</h2>
            <div>
              <label className="block font-semibold mb-1">Title</label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Content</label>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2"
                rows="5"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleEditImageChange}
              />
              {editImage && (
                <img
                  src={editImage}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-md mt-2"
                />
              )}
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                disabled={editLoading}
              >
                {editLoading ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                onClick={() => setEditing(false)}
                disabled={editLoading}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default Uploads;
