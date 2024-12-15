import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import { fetchTracksByGenreAndLanguage, logoutSpotify } from "./spotifyService";
// import { useNavigate } from "react-router-dom";
import "./Main.css";
import Paper from "./components/Paper";
import Loader from "./components/Loader";
import AudioVisualizer from "./components/AudioVisualizer";

const Main = () => {
  const [cameraOn, setCameraOn] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [mood, setMood] = useState("Detecting...");
  const [tracks, setTracks] = useState([]);
  const [language, setLanguage] = useState("en");
  const [lastFrame, setLastFrame] = useState(null); // State to store the last frame image
  const [loadingTracks, setLoadingTracks] = useState(false); // Track loading state
  const webcamRef = useRef(null);
  // const navigate = useNavigate();

  const loadModels = async () => {
    await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
    await faceapi.nets.faceExpressionNet.loadFromUri("/models");
  };

  const detectEmotion = async () => {
    if (webcamRef.current && webcamRef.current.video.readyState === 4) {
      const video = webcamRef.current.video;

      try {
        const options = new faceapi.TinyFaceDetectorOptions({
          inputSize: 416,
          scoreThreshold: 0.5,
        });

        const detections = await faceapi
          .detectAllFaces(video, options)
          .withFaceExpressions();

        if (!detections || detections.length === 0) {
          setMood("No face detected");
          return;
        }

        const highestEmotion = detections[0]?.expressions
          ? Object.keys(detections[0].expressions).reduce((a, b) =>
              detections[0].expressions[a] > detections[0].expressions[b] ? a : b
            )
          : "Neutral";

        setMood(highestEmotion.charAt(0).toUpperCase() + highestEmotion.slice(1));

        // Capture the last frame using getScreenshot
        const screenshot = webcamRef.current.getScreenshot();
        setLastFrame(screenshot); // Save the last frame image
        setCameraOn(false); // Turn off the camera
      } catch (error) {
        console.error("Error during emotion detection:", error);
      }
    }
  };

  const handleStartCamera = () => {
    setCameraOn(true);
    setCameraReady(false);
    loadModels();
    setTimeout(() => {
      setCameraReady(true);
    }, 0);
    setTimeout(detectEmotion, 3000);
  };

  const handleRefreshTracks = () => {
    setLoadingTracks(true); // Set loading state to true while fetching
    fetchTracksByGenreAndLanguage(mood.toLowerCase(), language).then((fetchedTracks) => {
      setTracks(fetchedTracks);
      setLoadingTracks(false); // Set loading state to false once tracks are fetched
    });
  };

  useEffect(() => {
    if (mood !== "Detecting..." && mood !== "Face not detected") {
      setLoadingTracks(true); // Set loading state to true while fetching
      fetchTracksByGenreAndLanguage(mood.toLowerCase(), language).then((fetchedTracks) => {
        setTracks(fetchedTracks);
        setLoadingTracks(false); // Set loading state to false once tracks are fetched
      });
    }
  }, [mood, language]);

  const handleLogout = () => {
    logoutSpotify();
  };

  return (
    <div className="container">
      <div className="left-panel">
        <div className={`camera-window ${cameraOn ? "active" : ""}`}>
          {cameraOn && cameraReady ? (
            <Webcam
              ref={webcamRef}
              audio={false}
              videoConstraints={{
                width: 1280,
                height: 720,
                facingMode: "user",
              }}
              className="webcam-video"
              screenshotFormat="image/jpeg" 
            />
          ) : (
            lastFrame && (
              <img
                src={lastFrame}
                alt="Last frame"
                className="webcam-video"
              />
            )
          )}
        </div>
       
        <button onClick={handleStartCamera} className="button start-camera">
          {cameraOn ? "Detecting..." : "Start Camera"}
        </button>
        <button onClick={handleLogout} className="button logout">
          Logout
        </button>
      </div>
      <div className="main-section">
        <h1 id="flashing-text">
          <span>M</span>
          <span>O</span>
          <span>O</span>
          <span>D</span>
          <span>I</span>
          <span>F</span>
          <span>Y</span>
        </h1>
        <h2 className="mood-title">Mood: {mood}</h2>
        <div className="language-select">
          <label htmlFor="language-select">Language:</label>
          <select
            id="language-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="hi">Hindi</option>
            <option value="de">German</option>
            <option value="pa">Punjabi</option>
            <option value="bho">Bhojpuri</option>
          </select>
         
        </div>
        <button onClick={handleRefreshTracks} className="button refresh">
          Refresh Tracks
        </button>
        <div className="tracks-grid">
          {loadingTracks ? (
            <Loader/>
          ) : tracks.length > 0 ? (
            tracks.map((track) => (
              <iframe
                key={track.id}
                src={`https://open.spotify.com/embed/track/${track.id}`}
                width="300"
                height="80"
                frameBorder="0"
                allow="encrypted-media"
                title={track.name}
                className="track"
                // onClick={() => handleTrackSelect(track.preview_url)} 
              ></iframe>              
            ))
          ) : (!loadingTracks && tracks.length === 0 && mood !== "Detecting..." && mood !=="No face detected" && (
             <Paper/> 
          ))}
        </div>
        {/* {audioUrl && <AudioVisualizer audioUrl={audioUrl} />} */}
      </div>
    </div>
  );
};

export default Main;
