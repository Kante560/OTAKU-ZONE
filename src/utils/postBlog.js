// Simple helper to post a blog to your backend using the token from localStorage

export async function postBlog({ title, writeUp, imageUrl }) {
  const token = localStorage.getItem("auth_token");
  if (!token) throw new Error("Not authenticated");

  const res = await fetch("https://otaku-hub-api.vercel.app/api/posts/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Token ${token}`,
    },
    body: JSON.stringify({
      title,
      writeUp,
      image: imageUrl, // imageUrl should be a real URL from your backend, not a blob
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || err?.message || "Failed to post blog");
  }

  return await res.json();
}
