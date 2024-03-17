import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import Training from './Training';
import Patches from './Patches';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/training" element={<Training />} />
        <Route path="/patches" element={<Patches />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
