import { useState } from "react";
import { Link } from "react-router-dom";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("/user/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            });

            const data = await response.json();

            alert(data.msg);
        } catch (error) {
            console.log(error);
            alert("Something went wrong");
        }
    };

    return (
        <div className="auth">
            <aside className="auth-aside" aria-hidden="true">
                <h2>Start your notebook today.</h2>
                <p>Create an account and keep every note a click away, on any screen.</p>
                <div className="preview-stack">
                    <div className="preview"><strong>Project ideas</strong><span className="line"></span><span className="line short"></span></div>
                    <div className="preview"><strong>Shopping list</strong><span className="line"></span><span className="line short"></span></div>
                    <div className="preview"><strong>Daily journal</strong><span className="line"></span><span className="line short"></span></div>
                </div>
            </aside>

            <main className="auth-main">
                <div className="auth-card">
                    <h1>Create your account</h1>
                    <p className="page-sub">It only takes a few seconds.</p>

                    <form onSubmit={handleRegister}>
                        <label className="field">
                            <span>Name</span>
                            <input
                                type="text"
                                placeholder="Enter name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </label>

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

                        <button type="submit" className="btn btn-primary btn-block">Register</button>
                    </form>

                    <p className="auth-switch">
                        Already have an account? <Link to="/login">Log in</Link>
                    </p>
                </div>
            </main>
        </div>
    );
}

export default Register;