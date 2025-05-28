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

  // Get current user email for ownership check
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
        // Fetch comments for each post
        const postsWithComments = await Promise.all(
          data.map(async (post) => {
            try {
              const cres = await fetch(`https://otaku-hub-api.vercel.app/api/posts/${post.id}/comments/`, {
                headers: token ? { Authorization: `Token ${token}` } : {},
              });
              if (cres.ok) {
                const comments = await cres.json();
                return { ...post, comments, commentsCount: comments.length };
              }
            } catch {}
            return { ...post, comments: [], commentsCount: 0 };
          })
        );
        setPosts(postsWithComments);
      } catch (e) {
        setPosts([]);
      }
      setLoading(false);
    };
    fetchPosts();
  }, [showForm, posts.map(p => p.comments ? p.comments.length : 0).join(",")]); // refetch posts when showForm changes (i.e., after upload)

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

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      const res = await fetch(`https://otaku-hub-api.vercel.app/api/post/${postId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Token ${localStorage.getItem("auth_token")}`,
        },
      });
      if (res.status === 204) {
        setPosts(posts.filter((post) => post.id !== postId));
        alert("Post deleted");
      } else {
        alert("Failed to delete post");
      }
    } catch (e) {
      alert("Failed to delete post");
    }
  };

  // Track which posts the user has liked/disliked in local state
  const [userReactions, setUserReactions] = useState({}); // { [postId]: 'like' | 'dislike' | undefined }

  // Like/dislike handlers with backend integration
  const handleLike = async (postId) => {
    try {
      const res = await fetch(`https://otaku-hub-api.vercel.app/api/posts/${postId}/like/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${localStorage.getItem('auth_token')}`,
        },
      });
      if (res.ok) {
        // Refetch comments and likes/dislikes for this post only
        const cres = await fetch(`https://otaku-hub-api.vercel.app/api/posts/${postId}/comments/`, {
          headers: { Authorization: `Token ${localStorage.getItem('auth_token')}` },
        });
        const comments = cres.ok ? await cres.json() : [];
        const pres = await fetch(`https://otaku-hub-api.vercel.app/api/post/${postId}/`);
        const postData = pres.ok ? await pres.json() : {};
        setPosts(prev => prev.map(p =>
          p.id === postId
            ? { ...p, likes: postData.likes, dislikes: postData.dislikes, comments, commentsCount: comments.length }
            : p
        ));
      } else {
        alert('Failed to like post');
      }
    } catch {
      alert('Failed to like post');
    }
  };

  const handleDislike = async (postId) => {
    try {
      const res = await fetch(`https://otaku-hub-api.vercel.app/api/posts/${postId}/dislike/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${localStorage.getItem('auth_token')}`,
        },
      });
      if (res.ok) {
        // Refetch comments and likes/dislikes for this post only
        const cres = await fetch(`https://otaku-hub-api.vercel.app/api/posts/${postId}/comments/`, {
          headers: { Authorization: `Token ${localStorage.getItem('auth_token')}` },
        });
        const comments = cres.ok ? await cres.json() : [];
        const pres = await fetch(`https://otaku-hub-api.vercel.app/api/post/${postId}/`);
        const postData = pres.ok ? await pres.json() : {};
        setPosts(prev => prev.map(p =>
          p.id === postId
            ? { ...p, likes: postData.likes, dislikes: postData.dislikes, comments, commentsCount: comments.length }
            : p
        ));
      } else {
        alert('Failed to dislike post');
      }
    } catch {
      alert('Failed to dislike post');
    }
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
          className="w-full px-4 py-2 border border-purple-700 bg-black text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      {/* Floating "+" Icon (optional, can trigger navigation or modal) */}
      <motion.button
        onClick={() => setShowForm(true)}
        className="fixed bottom-8 right-8 z-50 bg-purple-700 hover:bg-red-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg text-4xl"
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
        <Post setShowForm={setShowForm} showForm={showForm} onPostUploaded={() => setShowForm(false)} />
      )}
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6 text-white">Blogs</h2>
        {loading ? (
          <div className="text-center text-lg text-purple-300 py-10">Loading blogs...</div>
        ) : (
          <>
            {/* User's own posts section */}
            {isAuthenticated && userPosts.length > 0 && (
              <div className="mb-10">
                <h3 className="text-2xl font-semibold mb-4 text-purple-700">Your Uploaded Blogs</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {userPosts
                    .filter(content =>
                      (content.title && content.title.toLowerCase().includes(search.toLowerCase())) ||
                      (content.content && content.content.toLowerCase().includes(search.toLowerCase()))
                    )
                    .map((content, index) => (
                      <div
                        key={content.id || index}
                        className="flex flex-col bg-gradient-to-r from-black via-purple-900 to-red-900 shadow-md rounded-lg overflow-hidden border border-purple-700 transform transition-transform duration-300 hover:scale-105"
                      >
                        {content.image && (
                          <Link
                            to={`/uploads/${content.id}`}
                            className="block group"
                          >
                            <img
                              src={content.image}
                              alt="Uploaded"
                              className="object-cover w-full h-48 overflow-hidden transition-transform duration-300 group-hover:scale-110 bg-black"
                              style={{ pointerEvents: "none" }}
                            />
                          </Link>
                        )}
                        <div className="p-6 flex flex-col justify-between w-full bg-black text-white flex-1">
                          <div className="flex justify-between items-start">
                            <Link
                              to={`/uploads/${content.id}`}
                              className="flex-1"
                            >
                              {content.title && (
                                <h3 className="text-xl font-bold mb-2 text-purple-300">{content.title}</h3>
                              )}
                              {content.content && (
                                <p className="text-purple-200 mb-4 line-clamp-3">{content.content}</p>
                              )}
                            </Link>
                           
                            {/* Debug info always visible for troubleshooting */}
                            {/* <span className="text-xs text-gray-400 block mt-1">author: {String(content.author)} | user: {String(userEmail)} | owner: {String(content.is_owner)}</span>*/}
                          </div> 
                          <div className="flex flex-col gap-2 mt-4">
                            <div className="flex space-x-6 items-center">
                              <button onClick={() => handleLike(content.id)} className="flex items-center text-2xl text-purple-300 hover:text-white">
                                👍 <span className="ml-1 text-base">{content.likes || 0}</span>
                              </button>
                              <button onClick={() => handleDislike(content.id)} className="flex items-center text-2xl text-red-400 hover:text-white">
                                👎 <span className="ml-1 text-base">{content.dislikes || 0}</span>
                              </button>
                            </div>
                            <div className="flex items-center text-purple-400 text-sm font-semibold">
                              <span role="img" aria-label="comments">💬</span>
                              <span className="ml-1">Comments: {content.commentsCount ?? (content.comments ? content.comments.length : 0)}</span>
                            </div>
                          </div>
                          {/* Comments Section */}
                          <div className="mt-4">
                            <form
                              onSubmit={async (e) => {
                                e.preventDefault();
                                const commentText = e.target.elements[`comment-input-${content.id}`].value.trim();
                                if (!commentText) return;
                                try {
                                  const res = await fetch(`https://otaku-hub-api.vercel.app/api/posts/${content.id}/comments/`, {
                                    method: 'POST',
                                    headers: {
                                      'Content-Type': 'application/json',
                                      Authorization: `Token ${localStorage.getItem('auth_token')}`,
                                    },
                                    body: JSON.stringify({ content: commentText }),
                                  });
                                  if (res.ok) {
                                    const newComment = await res.json();
                                    setPosts(prev => prev.map(p =>
                                      p.id === content.id
                                        ? { ...p, comments: [...(p.comments || []), newComment], commentsCount: (p.commentsCount || 0) + 1 }
                                        : p
                                    ));
                                    e.target.reset();
                                    alert('Comment sent!');
                                  } else {
                                    alert('Failed to post comment');
                                  }
                                } catch {
                                  alert('Failed to post comment');
                                }
                              }}
                              className="flex gap-2 mb-2"
                            >
                              <input
                                name={`comment-input-${content.id}`}
                                type="text"
                                placeholder="Add a comment..."
                                className="flex-1 px-3 py-1 rounded bg-gray-900 text-white border border-purple-700 focus:outline-none"
                                required
                              />
                              <button type="submit" className="bg-purple-700 text-white px-3 py-1 rounded hover:bg-purple-900">Reply</button>
                            </form>
                           
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
     
            {otherPosts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {otherPosts
                  .filter(content =>
                    (content.title && content.title.toLowerCase().includes(search.toLowerCase())) ||
                    (content.content && content.content.toLowerCase().includes(search.toLowerCase()))
                  )
                  .map((content, index) => (
                    <div
                      key={content.id || index}
                      className="flex flex-col bg-white shadow-md rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 border border-purple-700"
                    >
                      {content.image && (
                        <Link
                          to={`/uploads/${content.id}`}
                          className="block group"
                        >
                          <img
                            src={content.image}
                            alt="Uploaded"
                            className="object-cover w-full h-48 overflow-hidden transition-transform duration-300 group-hover:scale-110 bg-black"
                            style={{ pointerEvents: "none" }}
                          />
                        </Link>
                      )}
                      <div className="p-6 flex flex-col justify-between w-full bg-black text-white flex-1">
                        <div className="flex justify-between items-start">
                          <Link
                            to={`/uploads/${content.id}`}
                            className="flex-1"
                          >
                            {content.title && (
                              <h3 className="text-xl font-bold mb-2 text-white">{content.title}</h3>
                            )}
                            {content.content && (
                              <p className="text-white mb-4 w-[80%] line-clamp-3">{content.content}</p>
                            )}
                          </Link>
                          {((content.author && (content.author === userEmail || content.author === userEmail.split('@')[0])) || content.is_owner) && (
                            <button onClick={() => handleDeletePost(content.id)} className="text-purple-400 hover:text-red-500 text-xl">🗑️</button>
                          )}
                        </div>
                        <div className="flex flex-col gap-2 mt-4">
                          <div className="flex space-x-6 items-center">
                            <button onClick={() => handleLike(content.id)} className="flex items-center text-2xl text-white hover:text-purple-300">
                              👍 <span className="ml-1 text-base">{content.likes || 0}</span>
                            </button>
                            <button onClick={() => handleDislike(content.id)} className="flex items-center text-2xl text-red-400 hover:text-white">
                              👎 <span className="ml-1 text-base">{content.dislikes || 0}</span>
                            </button>
                          </div>
                          <div className="flex items-center text-purple-400 text-sm font-semibold">
                            <span role="img" aria-label="comments">💬</span>
                            <span className="ml-1">Comments: {content.commentsCount ?? (content.comments ? content.comments.length : 0)}</span>
                          </div>
                        </div>
                         {/* Show delete button only for user's own posts */}
                            {((content.author && (content.author === userEmail || content.author === userEmail.split('@')[0])) || content.is_owner) && (
                              <button
                                onClick={async (e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  if (window.confirm('Are you sure you want to delete this post?')) {
                                    try {
                                      const res = await fetch(`https://otaku-hub-api.vercel.app/api/post/${content.id}/`, {
                                        method: 'DELETE',
                                        headers: {
                                          Authorization: `Token ${localStorage.getItem('auth_token')}`,
                                        },
                                      });
                                      if (res.status === 204) {
                                        setPosts(prev => prev.filter(p => p.id !== content.id));
                                        alert('Post deleted');
                                      } else {
                                        alert('Failed to delete post');
                                      }
                                    } catch {
                                      alert('Failed to delete post');
                                    }
                                  }
                                }}
                                className="text-red-500 hover:text-white hover:bg-red-600 transition-colors duration-200 rounded-full p-2 ml-2 shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                                title="Delete Post"
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, background: 'rgba(255,255,255,0.1)' }}
                              >
                                <span role="img" aria-label="delete">🗑️</span>
                              </button>
                            )}
                   
                        {/* Comments Section */}
                        <div className="mt-4">
                          <form
                            onSubmit={async (e) => {
                              e.preventDefault();
                              const commentText = e.target.elements[`comment-input-${content.id}`].value.trim();
                              if (!commentText) return;
                              try {
                                const res = await fetch(`https://otaku-hub-api.vercel.app/api/posts/${content.id}/comments/`, {
                                  method: 'POST',
                                  headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Token ${localStorage.getItem('auth_token')}`,
                                  },
                                  body: JSON.stringify({ content: commentText }),
                                });
                                if (res.ok) {
                                  const newComment = await res.json();
                                  setPosts(prev => prev.map(p =>
                                    p.id === content.id
                                      ? { ...p, comments: [...(p.comments || []), newComment], commentsCount: (p.commentsCount || 0) + 1 }
                                      : p
                                  ));
                                  e.target.reset();
                                  alert('Comment sent!');
                                } else {
                                  alert('Failed to post comment');
                                }
                              } catch {
                                alert('Failed to post comment');
                              }
                            }}
                            className="flex gap-2 mb-2"
                          >
                            <input
                              name={`comment-input-${content.id}`}
                              type="text"
                              placeholder="Add a comment..."
                              className="flex-1 px-3 py-1 rounded bg-gray-900 text-white border border-purple-700 focus:outline-none"
                              required
                            />
                            <button type="submit" className="bg-purple-700 text-white px-3 py-1 rounded hover:bg-purple-900">Reply</button>
                          </form>
                     
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-center text-lg text-gray-500 py-10">Sign up/ Login to see blogs (kante's laws).</p>
            )}          </>
        )}
      </div>
    </>
  );
};

export default Blog;