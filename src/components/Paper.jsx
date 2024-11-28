import { useState } from "react"
import React from 'react'
import "../globals.css"

function Paper() {
    const [flipped, setFlipped] = useState(false);

    const flipPage = () => {
      setFlipped(!flipped);
    };
  
    return (
      <div className="app">
        <div className={`content-main ${flipped ? "flipped" : ""}`}>
          <div className="content-box">
            <div className="front">
              <h2>TRACKS HAVEN'T LOADED???</h2>
              <p>It's Spotify's fault. I'm perfect.</p>
              <button onClick={flipPage}>Trust Issues?</button>
            </div>
            <div className="back">
              <h2>Check logs</h2>
              <p>Now, Logout and try again... </p>
              <button onClick={flipPage}>Flip Back</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  export default Paper;
