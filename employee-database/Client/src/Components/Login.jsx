import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
 import './Login.css'; // Import the CSS file

function Login({ setIsLoggedIn }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        axios.post("http://localhost:3001/auth/login", { email, password }, { withCredentials: true })
            .then(result => {
                if (result.data === "Success") {
                    axios.get('http://localhost:3001/auth/user', { withCredentials: true })
                        .then(response => {
                            if (response.data.user) {
                                setIsLoggedIn(true);
                                localStorage.setItem("userName", response.data.user.name);
                                navigate("/home", { state: { user: response.data.user } });
                            }
                        });
                } else {
                    alert("Login failed");
                }
            })
            .catch(err => console.log(err));
    };

    return (
        <div className="login-wrapper">
            <div className="login-container">
                <h1 className="login-heading">Login</h1>
                <form onSubmit={handleLogin} className="login-form">
                    <input
                        className="login-field"
                        type="email"
                        placeholder="Enter Email"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        className="login-field"
                        type="password"
                        placeholder="Enter Password"
                        required
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="login-button" type="submit">Login</button>
                </form>
                <p>Don't have an account? <a href="/signup" className="signup-link">Sign Up</a></p>
            </div>
        </div>
    );
}

export default Login;
