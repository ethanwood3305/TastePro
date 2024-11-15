import React, { useState } from "react";
import { supabase } from "../supabase";
import { Link, useNavigate } from "react-router-dom";
import Modal from "react-modal";
import "./Auth.css"; // Ensure this CSS file is imported

// Set the app element for accessibility
Modal.setAppElement("#root");

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      alert(error.message); // Keep as alert for errors
    } else {
      setIsModalOpen(true); // Open modal on successful signup
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    navigate("/login"); // Redirect to login after closing modal
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>Welcome to TastePro! 👋</h1>
        <p>Create your account</p>
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
        <button onClick={handleSignup}>Sign Up Now</button>
        <p className="signup-link">
          Already have an account? <Link to="/login">Login Here</Link>
        </p>
      </div>

      {/* Success Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Signup Success"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>🎉 Signup Successful!</h2>
        <p>Please check your email to confirm your account.</p>
        <button onClick={closeModal}>Go to Login</button>
      </Modal>
    </div>
  );
};

export default Signup;
