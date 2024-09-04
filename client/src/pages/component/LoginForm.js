import React, { useState } from "react";
import "./LoginForm.css";

function LoginForm() {
    // State for form inputs
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission behavior
    
        try {
            const response = await fetch("http://localhost:4000/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });
    
            const result = await response.json();
    
            if (response.ok) {
                // Successful login
                console.log(result.message); // e.g., "Login successful"
                console.log(`Welcome ${result.username}`);
            } else {
                // Handle login failure (invalid credentials or other errors)
                console.log(result.message); // e.g., "Invalid credentials"
            }
        } catch (error) {
            console.error("Error during login:", error.message || error);
        }
    };
    

    return (
        <div className="loginform">
            <form onSubmit={handleSubmit}>
                <h1 className="logo">RareTrades</h1>
                
                <div className="login--input-box">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)} // Update username state
                        required
                    />
                </div>
                
                <div className="login--input-box">
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} // Update password state
                        required
                    />
                </div>

                <button type="submit">Submit</button>

                <div className="login--remember-forgot">
                    <label>
                        <input type="checkbox" /> Remember me
                    </label>
                    <a href="#">Forgot password?</a>
                </div>

                <div className="login--register">
                    <p>
                        Don't have an account? <a href="#">Register</a>
                    </p>
                </div>
            </form>
        </div>
    );
}

export default LoginForm;
