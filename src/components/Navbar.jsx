import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { isLoggedIn, logout } = useContext(AuthContext);

  return (
    <nav className="sticky z-1000 top-0 w-full bg-gradient-to-l from-purple-300 to-purple-800 shadow-md py-4 px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold text-black">
          <Link
            to="/"
            className="bg-gradient-to-r from-purple-300 shadow-md to-purple-800 bg-clip-text text-transparent"
          >
            OTAKUVERSE
          </Link>
        </div>
        <ul className="flex space-x-6 text-gray-700">
          <li>
            <Link to="/" className="hover:text-black text-white hover:underline">
              Home
            </Link>
          </li>
          <li>
            <Link to="/blog" className="hover:text-black text-white hover:underline">
              Blogs
            </Link>
          </li>
          {isLoggedIn ? (
            <>
              <li>
                <Link to="/user" className="hover:text-black text-white hover:underline">
                  User-Info
                </Link>
              </li>
              <li>
                <button
                  onClick={logout}
                  className="hover:text-black text-white hover:underline"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="hover:text-black text-white hover:underline">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-black text-white hover:underline">
                  Signup
                </Link>
              </li>
            </>
          )}
        </ul>
        <button className="bg-white text-black py-2 px-4 rounded-lg hover:bg-black hover:text-white transition duration-300">
          Subscribe
        </button>
      </div>
    </nav>
  );
}
