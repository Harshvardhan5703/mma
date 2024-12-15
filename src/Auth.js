import React, { useEffect, useState } from "react";
import { getSpotifyAuthUrl, getAccessTokenFromUrl, setSpotifyAccessToken, isTokenValid, getAccessTokenFromCode } from "./spotifyService";
import { useNavigate } from "react-router-dom";
import './Auth.css';

const Auth = () => {
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const code = queryParams.get('code');

    if (code) {
      getAccessTokenFromCode(code).then(tokenData => {
        setSpotifyAccessToken(tokenData);
        navigate("/main");
      }).catch(error => {
        console.error("Failed to obtain access token:", error);
      });
    } else if (isTokenValid()) {
      navigate("/main");
    }
  }, [navigate]);

  const handleOpenDialog = () => {
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
  };

  const handleLogin = () => {
    const authUrl = getSpotifyAuthUrl();
    window.location = authUrl;
  };

  const handleGuestLogin = async () => {
    const guestAuthUrl = getSpotifyAuthUrl('guest@example.com', 'guestPassword123'); // Update with guest credentials
    window.location = guestAuthUrl;
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-left">
          <img
            src="/authimage.jpg"
            alt="Moodify"
          />
        </div>
        <div className="auth-right">
          <h2 className="auth-heading">
            Welcome to <span className="flickering-text">
              <span className="letter">m</span>
              <span className="letter ">o</span>
              <span className="letter flicker">o</span>
              <span className="letter flicker">d</span>
              <span className="letter ">i</span>
              <span className="letter">f</span>
              <span className="letter flicker">y</span>
            </span>
          </h2>

          <p className="auth-description">Connect and listen music according to your mood!</p>
          <button onClick={handleLogin} className="spotify-button">
            Connect to Spotify
          </button>
          <button onClick={handleGuestLogin} className="guest-button">
            Login as Guest
          </button>
          <p id="know">Wanna know how I work? <button id="read" onClick={handleOpenDialog}>READ</button></p>
        </div>
      </div>
      {showDialog && (
        <div className="dialog-overlay" onClick={handleCloseDialog}>
          <div
            className={`dialog-box ${showDialog ? "unfold" : "fold"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="dialog-content">
              <p>First and foremost, I want to clarify that I do not store any of your personal data.<br/>
               Your music preferences are entirely between you and Spotify. Once you grant me permission to access your Spotify account, I will be able to understand your music tastes. Then, whenever you show me your beautiful face, I will analyze your mood through facial recognition. Along with displaying your face during the detection, I will fetch music recommendations based on your mood, preferred language, and musical choices.<br/> <em>I'm still learning and improving...</em></p>
              <button onClick={handleCloseDialog} className="close-button">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Auth;
