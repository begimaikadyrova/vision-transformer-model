import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div>
      <h1>Vision Transformer Model</h1>
      <nav>
        <Link to="/patches">Patches</Link> |{" "}
        <Link to="/training">Train Model</Link>
      </nav>
    </div>
  );
}

export default HomePage;
