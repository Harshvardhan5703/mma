import React from "react";
import { Navigate } from "react-router-dom";
import { getStoredAccessToken } from "./spotifyService"; // Import the function to get the stored token

const ProtectedRoute = ({ component: Component }) => {
  // Use the helper function to check if a valid token exists
  const token = getStoredAccessToken();

  return token ? <Component /> : <Navigate to="/" />;
};

export default ProtectedRoute;
