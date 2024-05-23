import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import { TbPhotoSearch } from "react-icons/tb";
import { BsFillQuestionCircleFill } from "react-icons/bs";
import { IoAppsSharp } from "react-icons/io5";
import { FaRegChartBar } from "react-icons/fa";
import { BsDiagram3Fill } from "react-icons/bs";
import { PiTerminalWindow } from "react-icons/pi";
import { FaArrowCircleRight } from "react-icons/fa";





function Patches() {
  const [patchImages, setPatchImages] = useState([]);
  const [texts, setTexts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showImages, setShowImages] = useState(false);
  const [showDescription, setShowDescription] = useState(true);
  const [error, setError] = useState('');

  const fetchImages = () => {
    setLoading(true);
    setShowDescription(false);
    setShowImages(false);
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
        setShowImages(true);  
        setError('');
      })
      .catch(error => {
        setLoading(false);
        setError(`There was a problem with the fetch operation: ${error.message}`);
      });
  };

  const toggleImages = () => {
    setShowImages(!showImages);
    setShowDescription(!showDescription);
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
              <PiTerminalWindow size={21}/>
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
        <h3>Understanding Patches in Vision Transformer</h3>
        {error && (
        <div className='error-message'>{error}</div>
      )}
        {showDescription && (
          <>
            <div className='patchespage'>
              <p className="centered-text" style={{lineHeight: "2", marginTop: "0"}}>
              Explore how Vision Transformers split images into small, manageable segments known as patches.
              <br></br>
                Each patch plays a crucial role in the model's understanding of the entire image.
                </p>

              <p><b>Click on the button below</b> to view how Vision Transformers preprocess visuals by breaking them into patches.
              </p>
            </div>
          </>
        )}
         {!loading && showImages && (
          <button className="button button--show" onClick={toggleImages} style={{ marginBottom: '10px', marginTop: '10px' }}>
            <span>Hide Images</span>
          </button>
        )}
        {loading && (
          <div className='centerParagraph'>
            <p style={{ fontSize: '18px' }}>Images are being processed, please wait a moment...<img src="/loading-gif.gif" alt="Loading" style={{ width: '20px', height: '18px', marginLeft: '5px' }} /></p>
          </div>
        )}
        {!loading && showImages && (
          <>
            <button className="button button--show" onClick={fetchImages} style={{ marginBottom: '10px', marginTop: '10px' }}>
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}> Next Images
                <FaArrowCircleRight size={22} style={{ marginLeft: '5px' }} />
              </span>
            </button>

            <div className="imagesContainer">
              {patchImages.map((src, index) => (
                <img key={index} src={`data:image/png;base64,${src}`} alt={`Patch ${index}`} />
              ))}
            </div>
            {texts.map((text, index) => (
              <b><p key={index} className="customFont">{text}</p></b>
            ))}
          </>
        )}
         {!showImages && !loading && (
          <div className="centerContainer">
            <button className="button button--show" onClick={fetchImages}>
              <span>Show Images</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Patches;