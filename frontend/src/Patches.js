import React, { useState, useEffect, useRef} from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import { TfiLayoutGrid3Alt } from "react-icons/tfi";
import { MdDisplaySettings } from "react-icons/md";
import { BsFillDiagram2Fill } from "react-icons/bs";
import { VscServerProcess } from "react-icons/vsc";




function Patches() {
  const initialized = useRef(false)
  const [patchImages, setPatchImages] = useState([]);
  const [texts, setTexts] = useState([]);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
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
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
}}, []);
  

  return (
    <div className="App">
      <div className="sidebar">
        <nav>
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
      <div className="imagesContainer"> 
        {patchImages.map((src, index) => (
          <img key={index} src={`data:image/png;base64,${src}`} alt={`Patch ${index}`} />
        ))}
      </div>
      {texts.map((text, index) => (
        <p key={index} className="customFont">{text}</p>
      ))}
      </div>
    </div>
  
  );
}

export default Patches;

