import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import Training from './Training';
import Patches from './Patches';
import Graph from './Graph';
import './App.css';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/training" element={<Training />} />
        <Route path="/patches" element={<Patches />} />
        <Route path="/graph" element={<Graph />} />

       
      </Routes>
    </Router>
  );
}

export default App;
