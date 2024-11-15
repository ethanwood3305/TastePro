import React, { useState } from "react";
import { supabase } from "../supabase";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert(error.message);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>Welcome Back to TastePro! 👋</h1>
        <p>Please log in to your account</p>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login Now</button>
        <p className="signup-link">
          Not Registered Yet? <Link to="/signup">Sign Up Now</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
