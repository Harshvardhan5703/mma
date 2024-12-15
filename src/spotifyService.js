import SpotifyWebApi from "spotify-web-api-js";

const spotifyApi = new SpotifyWebApi();

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET;
const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";

const RESPONSE_TYPE = "code";

const moodToGenreMap = {
   Happy: ["pop", "dance"],
   Sad: ["acoustic", "blues"], 
   Angry: ["rock", "metal"],
   Surprised: ["electronic"], 
   Neutral: ["jazz", "classical"], }; 
   
const languageKeywordMap = { 
   en: "English",
   es: "Reggaeton OR Latino",
   fr: "Chanson Française",
   hi: "Bollywood OR Desi",
   de: "Schlager",
   pa: "Punjabi OR Bhangra",
   bho: "Bhojpuri", };


export const getSpotifyAuthUrl = (email, password) => {
  const scopes = encodeURIComponent("streaming user-read-email");
  let authUrl = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&response_type=${RESPONSE_TYPE}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${scopes}`;
  
  if (email && password) {
    authUrl += `&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
  }
  
  return authUrl;
};

export const getAccessTokenFromCode = async (code) => {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)
    },
    body: `grant_type=authorization_code&code=${encodeURIComponent(code)}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`
  });

  if (!response.ok) {
    throw new Error('Failed to obtain access token');
  }

  const tokenData = await response.json();
  return {
    token: tokenData.access_token,
    expiresAt: Date.now() + tokenData.expires_in * 1000
  };
};

export const getAccessTokenFromUrl = () => {
  const hash = window.location.hash;
  if (hash) {
    const token = hash
      .substring(1)
      .split("&")
      .find((item) => item.startsWith("access_token"))
      .split("=")[1];
    const expiresIn = hash
      .substring(1)
      .split("&")
      .find((item) => item.startsWith("expires_in"))
      .split("=")[1];
    
    return {
      token,
      expiresAt: Date.now() + parseInt(expiresIn) * 1000
    };
  }
  return null;
};

export const setSpotifyAccessToken = (tokenData) => {
  spotifyApi.setAccessToken(tokenData.token);
  localStorage.setItem("spotifyTokenData", JSON.stringify(tokenData));
};

export const logoutSpotify = () => {
  localStorage.removeItem("spotifyTokenData");
  spotifyApi.setAccessToken(null);
  window.location.href = "/";
};

export const getStoredAccessToken = () => {
  const storedTokenData = localStorage.getItem("spotifyTokenData");
  if (storedTokenData) {
    const parsedTokenData = JSON.parse(storedTokenData);
    
    // Check if token is expired
    if (parsedTokenData.expiresAt > Date.now()) {
      return parsedTokenData.token;
    }
  }
  return null;
};

export const isTokenValid = () => {
  const token = getStoredAccessToken();
  return !!token;
};

export const fetchTracksByGenreAndLanguage = async (mood, language) => {
  // Ensure we have a valid token before making the request
  const token = getStoredAccessToken();
  if (!token) {
    throw new Error("No valid access token. Please re-authenticate.");
  }

  const genres = moodToGenreMap[mood] || ["pop"];
  const languageKeywords = languageKeywordMap[language] || "";

  const query = `${genres[0]} ${languageKeywords}`.trim();

  try {
    const response = await spotifyApi.searchTracks(query, {
      limit: 50,
    });

    const tracks = response.tracks.items;
    const shuffledTracks = shuffleArray(tracks);
   
    return shuffledTracks.slice(0, 9);
  } catch (error) {
    console.error("Error fetching tracks:", error);
    
    // Specific handling for 401 errors
    if (error.status === 401) {
      // Clear the invalid token
      logoutSpotify();
      throw new Error("Token expired. Please log in again.");
    }
    
    return [];
  }
};

// Helper function to shuffle the array
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export default spotifyApi;
