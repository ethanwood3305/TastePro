import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase"; // Ensure this is the correct path to your Supabase client
import "./Subscribe.css"; // Custom CSS for styling

const Subscribe = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the current user
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error);
      } else {
        setUser(data.user); // Set the user data to display email
      }
    };

    fetchUser();
  }, []);

  const handleMonthlySubscribe = () => {
    alert("Monthly subscription flow will be implemented here!");
  };

  const handleAnnualSubscribe = () => {
    alert("Annual subscription flow will be implemented here!");
  };

  const features = [
    "Weekly <strong>Meal Planning</strong>",
    "Automatic <strong>Shopping Lists</strong>",
    "Daily Updated <strong>Prices</strong>",
    "Custom <strong>Food Exclusions</strong>",
  ];

  return (
    <div className="page-container">
      <nav className="navbar">
        <div className="navbar-left">
          <button className="home-button" onClick={() => navigate("/dashboard")}>Home</button>
          <button onClick={() => navigate("/subscribe")}>Subscribe</button>
        </div>
        <div className="navbar-right">
          <div className="user-info">
            <p>Logged in as:</p>
            <span>{user ? user.email : "Loading..."}</span> {/* Display the user’s email */}
          </div>
          <button onClick={() => navigate("/login")}>Logout</button>
        </div>
      </nav>
      <div className="subscribe-container">
        <h1>Choose Your Subscription Plan</h1>
        <div className="subscribe-plans">
          {/* Monthly Plan */}
          <div className="plan-card">
            <h2>Monthly Plan</h2>
            <p className="price">£5.99<span>/month</span></p>
            <ul>
              {features.map((feature, index) => (
                <li key={index} dangerouslySetInnerHTML={{ __html: feature }} />
              ))}
            </ul>
            <button onClick={handleMonthlySubscribe} className="subscribe-button">Subscribe Monthly</button>
          </div>

          {/* Annual Plan */}
          <div className="plan-card">
            <h2>Annual Plan</h2>
            <p className="price">£63.50<span>/year</span></p>
            <p className="discount">Save 12% with annual payments</p>
            <ul>
              {features.map((feature, index) => (
                <li key={index} dangerouslySetInnerHTML={{ __html: feature }} />
              ))}
            </ul>
            <button onClick={handleAnnualSubscribe} className="subscribe-button">Subscribe Annually</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscribe;
