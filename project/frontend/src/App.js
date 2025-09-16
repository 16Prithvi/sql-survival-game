import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import MapPage from "./pages/MapPage";
import GamePage from "./pages/GamePage";
import ZoneCompletionPage from "./pages/ZoneCompletionPage";
import { GameProvider } from "./context/GameContext";

function App() {
  return (
    <GameProvider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/game/:zone" element={<GamePage />} />
            <Route path="/complete/:zone" element={<ZoneCompletionPage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </GameProvider>
  );
}

export default App;