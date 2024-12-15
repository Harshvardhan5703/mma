import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAccessTokenFromCode, setSpotifyAccessToken } from "./spotifyService";

const CallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const code = queryParams.get('code');

    if (code) {
      getAccessTokenFromCode(code).then(tokenData => {
        setSpotifyAccessToken(tokenData);
        navigate("/main");
      }).catch(error => {
        console.error("Failed to obtain access token:", error);
        navigate("/"); // Redirect back to auth page on error
      });
    } else {
      console.error("No code found in URL.");
      navigate("/"); // Redirect back to auth page if no code
    }
  }, [navigate]);

  return <div>Authenticating...</div>;
};

export default CallbackPage;
