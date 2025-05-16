import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Footer from "./pages/Footer";
import Home from "./components/Home";
import Blog from "./pages/Blog";
import User from "./pages/User";
import Post from "./pages/Post";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Uploads from "./pages/Uploads";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/user" element={<User />} />
        <Route path="/post" element={<Post />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/Uploads/:id" element={<Uploads />} />
      </Routes>
      <Footer />
    </AuthProvider>
  );
}
