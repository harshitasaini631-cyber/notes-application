
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../api";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${API_URL}/user/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await response.json();

            if (data.token) {
                localStorage.setItem("token", data.token);
                alert(data.msg);
                navigate("/dashboard");
            } else {
                alert(data.msg);
            }
        } catch (error) {
            console.log(error);
            alert("Something went wrong");
        }
    };

    return (
        <div className="auth">
            <aside className="auth-aside" aria-hidden="true">
                <h2>Your thoughts, neatly kept.</h2>
                <p>Capture ideas, plans and reminders in one calm, organised place.</p>
                <div className="preview-stack">
                    <div className="preview"><strong>Meeting notes</strong><span className="line"></span><span className="line short"></span></div>
                    <div className="preview"><strong>Reading list</strong><span className="line"></span><span className="line short"></span></div>
                    <div className="preview"><strong>Weekend plans</strong><span className="line"></span><span className="line short"></span></div>
                </div>
            </aside>

            <main className="auth-main">
                <div className="auth-card">
                    <h1>Welcome back</h1>
                    <p className="page-sub">Log in to pick up where you left off.</p>

                    <form onSubmit={handleLogin}>
                        <label className="field">
                            <span>Email</span>
                            <input
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </label>

                        <label className="field">
                            <span>Password</span>
                            <input
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </label>

                        <button type="submit" className="btn btn-primary btn-block">Login</button>
                    </form>

                    <p className="auth-switch">
                        New here? <Link to="/register">Create an account</Link>
                    </p>
                </div>
            </main>
        </div>
    );
}

export default Login;
