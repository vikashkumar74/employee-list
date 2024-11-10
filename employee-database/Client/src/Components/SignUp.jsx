import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './SignUp.css'; // Import the CSS file

function SignUp() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSignup = (e) => {
        e.preventDefault();
        axios.post("http://localhost:3001/auth/signup", { name, email, password })
            .then(result => {
                if (result.status === 201) {
                    navigate("/login");
                }
            })
            .catch(err => {
                if (err.response && err.response.status === 400) {
                    window.alert("Email already exists. Please use a different email.");
                } else {
                    console.log(err);
                }
            });
    };

    return (
        <div className="signup-wrapper">
            <div className="signup-container">
                <h1 className="signup-heading">Sign Up</h1>
                <form onSubmit={handleSignup} className="signup-form">
                    <input
                        className="signup-field"
                        type="text"
                        placeholder="Enter Name"
                        required
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        className="signup-field"
                        type="email"
                        placeholder="Enter Email"
                        required
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        className="signup-field"
                        type="password"
                        placeholder="Enter Password"
                        required
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="signup-button" type="submit">Sign Up</button>
                </form>
                <p>Already have an account? <a href="/login" className="login-link">Login</a></p>
            </div>
        </div>
    );
}

export default SignUp;
