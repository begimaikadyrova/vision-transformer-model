import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import { TfiLayoutGrid3Alt } from "react-icons/tfi";
import { MdDisplaySettings } from "react-icons/md";
import { BsFillDiagram2Fill } from "react-icons/bs";
import { VscServerProcess } from "react-icons/vsc";
import { LiaHomeSolid } from "react-icons/lia";





function Patches() {
  const [patchImages, setPatchImages] = useState([]);
  const [texts, setTexts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showImages, setShowImages] = useState(false);

  const fetchImages = () => {
    setLoading(true);
    setShowImages(false);  // Ensure nothing is shown while loading
    fetch('http://localhost:5000/patches')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setPatchImages(data.images);
        setTexts(data.text);
        setLoading(false);
        setShowImages(true);  // Only show images after they are loaded
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        setLoading(false);
      });
  };

  const toggleImages = () => {
    setShowImages(!showImages);
  };


 


  return (
    <div className="App">
      <div className="sidebar">
        <nav>
        <Link to="/">
            <span className="nav-item">
            <LiaHomeSolid />
              <span>Main</span>
            </span>
          </Link>
          <Link to="/patches">
            <span className="nav-item">
              <TfiLayoutGrid3Alt />
              <span>Patches</span>
            </span>
          </Link>
          <Link to="/training">
            <span className="nav-item">
            <MdDisplaySettings />
              <span>Training</span>
            </span>
          </Link>
          <Link to="/graph">
            <span className="nav-item">
            <BsFillDiagram2Fill />
              <span>Graph</span>
            </span>
          </Link>
          <Link to="/progress">
            <span className="nav-item">
            <VscServerProcess />
              <span>Process</span>
            </span>
          </Link>
        </nav>
      </div>
      <div className="content">
        <h1>Patches</h1>
        {!loading && showImages && <button onClick={toggleImages} style={{ fontFamily: "'Roboto Mono', monospace", marginBottom: '10px', marginTop: '10px' }}>
          Hide Images
        </button>}
        {loading && <p style={{ fontSize: '18px' }}>Images are processing...</p>}
        {!loading && showImages && (
          <>
            <button onClick={fetchImages} style={{ fontFamily: "'Roboto Mono', monospace", marginBottom: '10px', marginTop: '10px' }}>Next Images&gt;&gt;&gt;</button>
            <div className="imagesContainer">
              {patchImages.map((src, index) => (
                <img key={index} src={`data:image/png;base64,${src}`} alt={`Patch ${index}`} />
              ))}
            </div>
            {texts.map((text, index) => (
              <p key={index} className="customFont">{text}</p>
            ))}
          </>
        )}
        {!showImages && !loading && <button onClick={fetchImages} style={{ fontFamily: "'Roboto Mono', monospace", marginBottom: '10px', marginTop: '10px' }}>
          Show Images
        </button>}
      </div>
    </div>
  );
}

export default Patches;