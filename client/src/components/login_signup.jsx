import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

import "../styles/login_signup.css";

import user_icon from '../assets/user_icon.png';
import email_icon from '../assets/email_icon.png';
import password_icon from '../assets/password_icon.png';

const LoginSignup = () => {
    const [action, setAction] = useState("Sign Up");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordErrors, setPasswordErrors] = useState([]);
    const [emailError, setEmailError] = useState("");

    const navigate = useNavigate();

    const validatePassword = (pwd) => {
        const errors = [];
        if (pwd.length < 8) errors.push("At least 8 characters");
        if (!/[A-Z]/.test(pwd)) errors.push("At least one uppercase letter");
        if (!/[a-z]/.test(pwd)) errors.push("At least one lowercase letter");
        if (!/[0-9]/.test(pwd)) errors.push("At least one number");
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) errors.push("At least one special character");
        return errors;
    };

    const handlePasswordChange = (e) => {
        const newPwd = e.target.value;
        setPassword(newPwd);
        if (action === "Sign Up") {
            const errors = validatePassword(newPwd);
            setPasswordErrors(errors);
        }
    };

    const handleSubmit = async () => {
        setEmailError("");

        if (action === "Sign Up" ) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                setEmailError("Please enter a valid email address");
                return;
            }

            const errors = validatePassword(password);
            if (errors.length > 0) {
                setPasswordErrors(errors);
                return;
            }
        }

        const endpoint = action === "Sign Up" ? "/signup" : "/login";
        const payload = action === "Sign Up" ? { name, email, password } : { email, password };

        try {
            const response = await fetch(`http://localhost:3001${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            alert(data.message);

            if (data.message.toLowerCase().includes("success")) {
                setName("");
                setEmail("");
                setPassword("");
                setPasswordErrors([]);
                setEmailError("");
            }

            if (action === "Sign Up" && data.message === "User registered successfully") {
                navigate("/register-health" , {state:{email}});
            }
             if (action === "Login" && data.message === "Login Successful") {
    // navigate("/main_page", { state: { email} }); // 👈 redirect to /home or your navbar page
    localStorage.setItem("userEmail", email); // ✅ Save email
    navigate("/main_page");
}
  
        } catch (err) {
            console.error("Error connecting to server", err);
        }
    };

    return (
        <div className='container'>
            <div className="header">
                <div className="text">{action}</div>
                <div className="underline"></div>
            </div>

            <div className="inputs">
                {action === "Sign Up" && (
                    <div className="input">
                        <img src={user_icon} alt="" />
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                )}

                <div className="input">
                    <img src={email_icon} alt="" />
                    <input
                        type="email"
                        placeholder="Email Id"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                {emailError && <div className="email-error">{emailError}</div>}

                <div className="input">
                    <img src={password_icon} alt="" />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                </div>
                {action === "Sign Up" && password && passwordErrors.length > 0 && (
                    <div className="password-validation">
                        <ul>
                            {passwordErrors.map((err, idx) => (
                                <li key={idx}>{err}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <div className="redirect-container">
                {action === "Login" ? (
                    <div className="redirect-text">
                        Don't have an account? <span onClick={() => setAction("Sign Up")}>Create one</span>
                    </div>
                ) : (
                    <div className="redirect-text">
                        Already have an account? <span onClick={() => setAction("Login")}>Log In</span>
                    </div>
                )}
            </div>

            <div className="submit-container">
                <div className="submit" onClick={handleSubmit}>{action}</div>
            </div>
        </div>
    );
};

export default LoginSignup;
