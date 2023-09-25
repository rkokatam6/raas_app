import React, { useState } from 'react';
import VideoPlayer from './VideoPlayer';
import Formations from './Formations';
import './App.css';



const App = () => {

  const [showFormations, setShowFormations] = useState(false);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="title">YouTube Video Player</h1>
        <button onClick={() => setShowFormations(!showFormations)}>Toggle Formations</button>
      </header>
      <main className="app-content">
        {showFormations ? <Formations /> : <VideoPlayer />}
      </main>
      <footer className="app-footer">
        <p>&copy; 2023 Your App Name. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
