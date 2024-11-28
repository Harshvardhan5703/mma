import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAccessTokenFromUrl, setSpotifyAccessToken } from "./spotifyService";

const CallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = getAccessTokenFromUrl(); // Extract token from URL
    if (token) {
      setSpotifyAccessToken(token); // Set token in Spotify API client
      navigate("/main"); // Redirect to the main app page
    } else {
      console.error("No token found in URL.");
      navigate("/"); // Redirect back to auth page
    }
  }, [navigate]);

  return <div>Authenticating...</div>;
};

export default CallbackPage;
