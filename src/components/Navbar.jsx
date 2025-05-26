import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";

export default function Navbar() {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ background: "linear-gradient(to left, #6d28d9, #c084fc)" }}
      animate={{
        background: [
          "linear-gradient(to left, #6d28d9, #c084fc)",
          "linear-gradient(to right, #a21caf, #ef4444)",
          "linear-gradient(to left, #6d28d9, #c084fc)"
        ]
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        repeatType: "loop"
      }}
      className="sticky z-1000 top-0 w-full shadow-md py-4 px-6 text-white bg-gradient-to-r from-purple-900 via-purple-700 to-red-600"
      style={{ backgroundSize: "200% 200%" }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <motion.div
          initial={{ background: "linear-gradient(to left, #6d28d9, #c084fc)" }}
          animate={{
            background: [
              "linear-gradient(to left, #6d28d9, #c084fc)",
              "linear-gradient(to left, #a21caf, #ef4444)",
              "linear-gradient(to left, #6d28d9, #c084fc)"
            ]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "loop"
          }}
          style={{ backgroundSize: "200% 200%" }}
          className="text-2xl font-bold text-white rounded-2xl px-3.5 min-w-auto"
        >
          <Link to="/" className="text-white bg-clip-text ">
            OTAKUVERSE
          </Link>
        </motion.div>

        {/* Hamburger menu button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
            </svg>
          )}
        </button>

        {/* Desktop menu */}
        <ul className="hidden md:flex space-x-6 text-gray-700">
          <li>
            <Link
              to="/"
              className="hover:text-black text-white hover:underline"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/blog"
              className="hover:text-black text-white hover:underline"
            >
              Blogs
            </Link>
          </li>
          {isAuthenticated ? (
            <>
              <li>
                <Link
                  to="/user"
                  className="hover:text-black text-white hover:underline"
                >
                  Profile
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  to="/login"
                  className="hover:text-black text-white hover:underline"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/signup"
                  className="hover:text-black text-white hover:underline"
                >
                  Signup
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* Desktop right buttons */}
        <ul className="hidden md:flex space-x-6">
          {isAuthenticated && (
            <li>
              <button
                onClick={handleLogout}
                className="bg-white text-black py-2 px-4 rounded-lg hover:bg-black hover:text-white transition duration-300"
              >
                Logout
              </button>
            </li>
          )}
     
        </ul>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden mt-4">
          <ul className="flex flex-col space-y-4 text-white bg-purple-900 rounded-lg p-4 shadow-lg">
            <li>
              <Link
                to="/"
                className="hover:text-black text-white hover:underline"
                onClick={() => setMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/blog"
                className="hover:text-black text-white hover:underline"
                onClick={() => setMenuOpen(false)}
              >
                Blogs
              </Link>
            </li>
            {isAuthenticated ? (
              <>
                <li>
                  <Link
                    to="/user"
                    className="hover:text-black text-white hover:underline"
                    onClick={() => setMenuOpen(false)}
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="bg-white text-black py-2 px-4 rounded-lg hover:bg-black hover:text-white transition duration-300 w-full text-left"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/login"
                    className="hover:text-black text-white hover:underline"
                    onClick={() => setMenuOpen(false)}
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/signup"
                    className="hover:text-black text-white hover:underline"
                    onClick={() => setMenuOpen(false)}
                  >
                    Signup
                  </Link>
                </li>
              </>
            )}
            <li>
              <button className="bg-white text-black py-2 px-4 rounded-lg hover:bg-black hover:text-white transition duration-300 w-full text-left">
                Subscribe
              </button>
            </li>
          </ul>
        </div>
      )}
    </motion.nav>
  );
}
