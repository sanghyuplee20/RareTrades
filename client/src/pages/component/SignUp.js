import { useState } from "react";
import "./LoginForm.css";  // Reuse the same styles as LoginForm

function SignUp() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState(""); // State for success or error message

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch("http://localhost:4000/api/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    password,
                    first_name: firstName,
                    last_name: lastName,
                    email,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                // Success message or redirection after successful signup
                setMessage(`User ${username} registered successfully!`);
            } else {
                // Handle error message (e.g., username/email already exists)
                setMessage(result.message || "Signup failed.");
            }
        } catch (error) {
            console.error("Error during signup:", error.message || error);
            setMessage("An error occurred. Please try again later.");
        }
    };

    return (
        <div className="loginform">
            <form onSubmit={handleSubmit}>
                <h1 className="logo">Sign Up</h1>

                <div className="login--input-box">
                    <input
                        type="text"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                </div>

                <div className="login--input-box">
                    <input
                        type="text"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                </div>

                <div className="login--input-box">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="login--input-box">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div className="login--input-box">
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit">Sign Up</button>

                {/* Message to display success or failure */}
                {message && <p>{message}</p>}
            </form>
        </div>
    );
}

export default SignUp;
