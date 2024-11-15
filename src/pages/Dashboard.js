import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css"; // Custom CSS for styling

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasSubscription, setHasSubscription] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndSubscription = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError || !userData.user) {
        console.error("Error fetching user or user not logged in:", userError);
        navigate("/login"); // Redirect to login if no user
        return;
      }

      setUser(userData.user);

      // Check subscription status
      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from("subscriptions")
        .select("status")
        .eq("user_id", userData.user.id)
        .eq("status", "active");

      if (subscriptionError) {
        console.error("Error checking subscription:", subscriptionError);
      } else if (subscriptionData && subscriptionData.length > 0) {
        setHasSubscription(true);
      }

      setLoading(false);
    };

    fetchUserAndSubscription();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (loading) {
    return <p>Loading...</p>; // Show loading message while checking authentication
  }

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-left">
          <button onClick={() => navigate("/dashboard")}>Home</button>
          <button onClick={() => navigate("/subscribe")}>Subscribe</button>
        </div>
        <div className="navbar-right">
          <div className="user-info">
            <p>Logged in as:</p>
            <span>{user.email}</span>
          </div>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>
      <div className="content">
        <h1>Welcome to Dashboard</h1>
        {hasSubscription ? (
          <p>Here is where your main content will go.</p>
        ) : (
          <p>You currently do not have an active subscription.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
