import React from "react";
import "./App.css";
import { Chessboard } from "./components/Chessboard";

function App() {
  return (
    <div className="grid h-dvh place-content-center bg-gray-900">
      <Chessboard />
    </div>
  );
}

export default App;
