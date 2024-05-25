import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import Training from './Training';
import Patches from './Patches';
import Graph from './Graph';
import Process from './Process';
import './App.css';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/training" element={<Training />} />
        <Route path="/patches" element={<Patches />} />
        <Route path="/graph" element={<Graph />} />
        <Route path="/process" element={<Process />} />
       
      </Routes>
    </Router>
  );
}

export default App;
