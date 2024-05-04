import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import { TbPhotoSearch } from "react-icons/tb";
import { BsFillQuestionCircleFill } from "react-icons/bs";
import { IoAppsSharp } from "react-icons/io5";
import { FaRegChartBar } from "react-icons/fa";
import { BsDiagram3Fill } from "react-icons/bs";
import { VscTerminal } from "react-icons/vsc";





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
        <nav className="nav-main">
        <span className="nav-title">
        <TbPhotoSearch size={19}/>
              <span><b>Vision Transformer</b></span>
            </span>
            <div className="nav-divider"></div>
          
          <Link to="/patches">
            <span className="nav-item">
              <IoAppsSharp size={18} />
              <span >Patches</span>
            </span>
          </Link>
          <Link to="/training">
            <span className="nav-item">
            <FaRegChartBar size={19}/>
              <span>Training</span>
            </span>
          </Link>
          <Link to="/graph">
            <span className="nav-item">
              <BsDiagram3Fill size={19}/>
              <span>Graph</span>
            </span>
          </Link>
          <Link to="/progress">
            <span className="nav-item">
              <VscTerminal size={19}/>
              <span>Process</span>
            </span>
          </Link>
          </nav>
          <div className="nav-footer">
          <Link to="/">
            <span className="nav-item">
              <BsFillQuestionCircleFill size={19}/>
              <span>About Tool</span>
            </span>
          </Link>
        </div>
      </div>
      <div className="content">
        <h1>Patches</h1>
        {!loading && showImages && <button className='hidebutton' onClick={toggleImages} style={{ fontFamily: "'Roboto Mono', monospace", marginBottom: '10px', marginTop: '10px' }}>
          Hide Images
        </button>}
        {loading && <p style={{ fontSize: '18px' }}>Images are processing...</p>}
        {!loading && showImages && (
          <>
            <button className="nextbutton" onClick={fetchImages} style={{ fontFamily: "'Roboto Mono', monospace", marginBottom: '10px', marginTop: '10px' }}>Next Images&gt;&gt;&gt;</button>
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
        {!showImages && !loading && <button className="button button--pan" onClick={fetchImages} style={{ fontFamily: "'Roboto Mono', monospace", marginBottom: '10px', marginTop: '10px' }}>
          <span>Show Images</span>
        </button>}
      </div>
    </div>
  );
}

export default Patches;