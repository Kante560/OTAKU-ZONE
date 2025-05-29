// DeletePostButton.jsx
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const DeletePostButton = ({ content, setPosts }) => {
  const { userId, token } = useContext(AuthContext);

  const handleDeletePost = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!token || parseInt(content.owner) !== parseInt(userId)) {
      toast.error("Unauthorized or invalid user.");
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`https://otaku-hub-api.vercel.app/api/post/${content.id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (res.status === 204) {
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== content.id));
        toast.success("Post deleted successfully");
      } else {
        toast.error("Failed to delete post");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the post");
    }
  };

  if (parseInt(content.owner) !== parseInt(userId)) return null;

  return (
    <button
      onClick={handleDeletePost}
      className="text-red-500 hover:text-white hover:bg-red-600 transition-colors duration-200 rounded-full p-2 ml-2 shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400"
      title="Delete Post"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 24,
        background: "rgba(255,255,255,0.1)",
      }}
    >
      <span role="img" aria-label="delete">🗑️</span>
    </button>
  );
};

export default DeletePostButton;
