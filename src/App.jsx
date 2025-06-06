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
import PrivateRoute from "./routes/PrivateRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    
    <AuthProvider>
        <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/user" element={
          <PrivateRoute>
            <User />
          </PrivateRoute>
        } />
        <Route path="/post" element={<Post />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/Uploads/:id" element={<Uploads />} />
      </Routes>
      <Footer />
    </AuthProvider>
    

  );
}
