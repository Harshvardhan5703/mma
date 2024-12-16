import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./Auth";
import MainPage from "./Main";
import CallbackPage from "./CallbackPage";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/callback" element={<CallbackPage />} />
        <Route path="/main" element={<ProtectedRoute component={MainPage} />} />
      </Routes>
    </Router>
  );
}

export default App;
