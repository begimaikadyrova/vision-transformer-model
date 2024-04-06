import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import Training from './Training';
import Patches from './Patches';
import './App.css';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/training" element={<Training />} />
        <Route path="/patches" element={<Patches />} />
       
      </Routes>
    </Router>
  );
}

export default App;
