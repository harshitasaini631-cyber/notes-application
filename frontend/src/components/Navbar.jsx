import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(
        localStorage.getItem("token") !== null
    );

    // "light" | "dark" | null (null = follow the system setting)
    const [theme, setTheme] = useState(localStorage.getItem("theme"));

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoggedIn(localStorage.getItem("token") !== null);
    }, [location]);

    useEffect(() => {
        const root = document.documentElement;
        if (theme) {
            root.setAttribute("data-theme", theme);
        } else {
            root.removeAttribute("data-theme");
        }
    }, [theme]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        navigate("/login");
    };

    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = theme ? theme === "dark" : systemDark;

    const toggleTheme = () => {
        const next = isDark ? "light" : "dark";
        localStorage.setItem("theme", next);
        setTheme(next);
    };

    const linkClass = (path) =>
        location.pathname === path ? "nav-link active" : "nav-link";

    return (
        <nav className="navbar">
            <Link to={isLoggedIn ? "/dashboard" : "/login"} className="brand">
                <span className="brand-mark" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
                    </svg>
                </span>
                <span>My Notes</span>
            </Link>

            <div className="nav-actions">
                {isLoggedIn ? (
                    <>
                        <Link to="/dashboard" className={linkClass("/dashboard")}>Dashboard</Link>
                        <Link to="/create" className={linkClass("/create")}>Create Note</Link>
                        <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className={linkClass("/login")}>Login</Link>
                        <Link to="/register" className={linkClass("/register")}>Register</Link>
                    </>
                )}

                <button
                    type="button"
                    className="icon-btn"
                    onClick={toggleTheme}
                    aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                    title={isDark ? "Light mode" : "Dark mode"}
                >
                    {isDark ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <circle cx="12" cy="12" r="4" />
                            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                        </svg>
                    ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" />
                        </svg>
                    )}
                </button>
            </div>
        </nav>
    );
}

export default Navbar;