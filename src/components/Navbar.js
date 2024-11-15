import React from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabase";

const Navbar = () => {
  // Access user as a property, not a function
  const user = supabase.auth.user;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <nav>
      <Link to="/">Home</Link>
      {user ? (
        <>
          <Link to="/dashboard">Dashboard</Link>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
