import SpotifyWebApi from "spotify-web-api-js";

const spotifyApi = new SpotifyWebApi();

const CLIENT_ID = "7a7d53dcaab94357921a491c45fb8eb9";
const REDIRECT_URI = "http://localhost:3000/callback";
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "token";

const moodToGenreMap = {
  Happy: ["pop", "dance"],
  Sad: ["acoustic", "blues"],
  Angry: ["rock", "metal"],
  Surprised: ["electronic"],
  Neutral: ["jazz", "classical"],
};

const languageKeywordMap = {
  en: "English", // English-language songs
  es: "Reggaeton OR Latino", // Spanish-related keywords
  fr: "Chanson Française", // French-related keywords
  hi: "Bollywood OR Desi", // Hindi-related keywords
  de: "Schlager", // German-related keywords
  pa: "Punjabi OR Bhangra", // Punjabi-related keywords
  bho: "Bhojpuri", // Bhojpuri-related keywords
};

export const getSpotifyAuthUrl = () => {
  return `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=streaming%20user-read-email`;
};

export const getAccessTokenFromUrl = () => {
  const hash = window.location.hash;
  if (hash) {
    const token = hash
      .substring(1)
      .split("&")
      .find((item) => item.startsWith("access_token"))
      .split("=")[1];
    return token;
  }
  return null;
};

export const setSpotifyAccessToken = (token) => {
  spotifyApi.setAccessToken(token);
  localStorage.setItem("spotifyAccessToken", token); // Save token for persistent session
};

export const logoutSpotify = () => {
  localStorage.removeItem("spotifyAccessToken"); // Clear token on logout
  spotifyApi.setAccessToken(null);
  window.location.href = "/"; // Redirect to login/auth page
};

export const getStoredAccessToken = () => {
  return localStorage.getItem("spotifyAccessToken");
};


export const fetchTracksByGenreAndLanguage = async (mood, language) => {
  const genres = moodToGenreMap[mood] || ["pop"];
  const languageKeywords = languageKeywordMap[language] || "";

  const query = `${genres[0]} ${languageKeywords}`.trim(); // Combine genre and language keywords

  try {
    const response = await spotifyApi.searchTracks(query, {
      limit: 50, // Increase limit to get more tracks
    });

    const tracks = response.tracks.items; // Tracks are inside items array

    // Randomize the tracks using a shuffle function
    const shuffledTracks = shuffleArray(tracks);
   
    return shuffledTracks.slice(0, 9); // Return the first 10 randomized tracks
  } catch (error) {
    console.error("Ik u will come, nvm READ :  Error fetching tracks by genre and language:", error);
    return [];
  }
};

// Helper function to shuffle the array
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
};

