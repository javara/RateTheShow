import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import CategoryPage from "./pages/CategoryPage";
import FavoritesPage from "./pages/FavoritesPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Logo from "./components/Logo";
import { logoutUser, isAuthenticated } from "./services/auth";
import "./styles.css";

function AppLayout() {
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(isAuthenticated());

  useEffect(() => {
    const handleAuthChange = () => {
      setAuthenticated(isAuthenticated());
    };

    handleAuthChange();
    window.addEventListener("storage", handleAuthChange);
    window.addEventListener("authChange", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleAuthChange);
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    logoutUser();
    setAuthenticated(false);
    setIsMobileMenuOpen(false);
    setIsCategoryMenuOpen(false);
    navigate("/login");
  };

  const closeMenus = () => {
    setIsMobileMenuOpen(false);
    setIsCategoryMenuOpen(false);
  };

  return (
    <>
      {authenticated && (
        <nav className="topNav">
          <div className="navBrand">
            <Logo />
          </div>

          <button
            type="button"
            className="menuToggleButton"
            onClick={() => setIsMobileMenuOpen((prevState) => !prevState)}
            aria-label="Toggle navigation menu"
          >
            ☰
          </button>

          <div className={`navLinks ${isMobileMenuOpen ? "open" : ""}`}>
            <Link to="/" className="navLink" onClick={closeMenus}>
              Home
            </Link>

            <div className={`navDropdown ${isCategoryMenuOpen ? "open" : ""}`}>
              <button
                className="navDropdownButton"
                type="button"
                onClick={() => setIsCategoryMenuOpen((prevState) => !prevState)}
                aria-label="Toggle Genres Menu"
              >
                Genres ▾
              </button>

              <div className="navDropdownMenu">
                <Link to="/category/drama" className="navDropdownItem" onClick={closeMenus}>
                  Drama
                </Link>
                <Link to="/category/comedy" className="navDropdownItem" onClick={closeMenus}>
                  Comedy
                </Link>
                <Link to="/category/scifi" className="navDropdownItem" onClick={closeMenus}>
                  Sci-Fi
                </Link>
                <Link to="/category/crime" className="navDropdownItem" onClick={closeMenus}>
                  Crime
                </Link>
              </div>
            </div>

            <Link to="/favorites" className="navLink" onClick={closeMenus}>
              ★ Favorites
            </Link>

            <a href="/#statistics" className="navLink" onClick={closeMenus}>
              Stats
            </a>

            <Link to={{ pathname: "/", hash: "#about" }} className="navLink" onClick={closeMenus}>
              About
            </Link>

            <button
              type="button"
              className="navLogoutButton"
              onClick={handleLogout}
            >
              Sign Out
            </button>
          </div>
        </nav>
      )}

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/category/:name"
          element={
            <ProtectedRoute>
              <CategoryPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <FavoritesPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
