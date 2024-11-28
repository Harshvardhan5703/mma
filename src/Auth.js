import React, { useEffect, useState } from "react";
import { getSpotifyAuthUrl, getAccessTokenFromUrl, setSpotifyAccessToken, getStoredAccessToken } from "./spotifyService";
import { useNavigate } from "react-router-dom";
import './Auth.css'; // Import the CSS file for styles

const Auth = () => {
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    const token = getAccessTokenFromUrl();
    if (token) {
      setSpotifyAccessToken(token);
      navigate("/main");
    } else if (getStoredAccessToken()) {
      navigate("/main");
    }
  }, [navigate]);
  // Open dialog
  const handleOpenDialog = () => {
    setShowDialog(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setShowDialog(false);
  };

  const handleLogin = () => {
    const authUrl = getSpotifyAuthUrl();
    window.location = authUrl;
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Left section with image */}
        <div className="auth-left">
          <img
            src="/authimage.jpg"
            alt="Moodify"
          />
        </div>
        {/* Right section with content */}
        <div className="auth-right">
        <h2 class="auth-heading">
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
          <p id="know">Wanna know how I work? <button id="read" onClick={handleOpenDialog}>READ</button></p>
        </div>
      </div>
        {/* Dialog */}
        {showDialog && (
        <div className="dialog-overlay" onClick={handleCloseDialog}>
          <div
            className={`dialog-box ${showDialog ? "unfold" : "fold"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="dialog-content">
              <p>FIRST <em> I don't store any of your data, the song preference is between you and Spotify.</em><br/>
                You authorize me to see your Spotify, then I get to know about your music choice, then,
                 whenever you show me your beautiful face, I will detect your mood,I will also show you the
                 your face at detection and then based on your mood, language and music choice, fetch you songs.<br/>
                 <em>I'm learning...</em>
              </p>
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