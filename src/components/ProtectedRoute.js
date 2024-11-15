import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { hasActiveSubscription } from "../utils/auth";

const ProtectedRoute = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    const checkAuthorization = async () => {
      const hasSubscription = await hasActiveSubscription();
      setIsAuthorized(hasSubscription);
    };

    checkAuthorization();
  }, []);

  if (isAuthorized === null) {
    return <p>Loading...</p>; // Show a loading message while checking
  }

  return isAuthorized ? children : <Navigate to="/subscribe" />;
};

export default ProtectedRoute;
