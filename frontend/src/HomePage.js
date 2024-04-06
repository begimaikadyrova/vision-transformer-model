import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';


function HomePage() {
  return (
    <div className="homePageContainer">
      <h1>Vision Transformer Model</h1>
      <nav>
        <Link to="/patches">Patches</Link> |{" "}
        <Link to="/training">Training</Link>
      </nav>
    </div>
  );
}

export default HomePage;
