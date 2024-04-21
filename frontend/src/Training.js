import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import { TfiLayoutGrid3Alt } from "react-icons/tfi";
import { MdDisplaySettings } from "react-icons/md";
import { BsFillDiagram2Fill } from "react-icons/bs";


function Training() {
  const initialized = useRef(false);
  const [layerData, setLayerData] = useState([]);
  const [position, setPosition] = useState(0);
  const [endPosition, setEndPosition] = useState(0);
  const [mediaInterval, setMediaInterval] = useState(null);
  const [showPictures, setShowPictures] = useState(false); // State to control visibility of pictures

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      fetch('http://localhost:5000/graph')
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          const layersWithImages = Object.entries(data.layer_weights).reduce((acc, [key, value]) => {
            if (value.length > 0) {
              acc.push({
                id: key,
                images: value.map(image => ({
                  label: image,
                  url: `http://localhost:5000/get_image/${image.replace(/\//g, '_')}_0`
                }))
              });
            }
            return acc;
          }, []);

          setLayerData(layersWithImages);
          setEndPosition(layersWithImages.length - 1);  // Assuming endPosition based on layer count
        })
        .catch(error => {
          console.error('There was a problem with the fetch operation:', error);
        });
    }

    return () => { // Cleanup on component unmount
      if (mediaInterval) {
        clearInterval(mediaInterval);
      }
    };
  }, [mediaInterval]);

  const onPlay = () => {
    setShowPictures(true); // Make pictures visible
    if (mediaInterval === null) {
      const newInterval = setInterval(() => {
        setPosition((prevPosition) => {
          if (prevPosition >= endPosition) {
            clearInterval(newInterval);
            return prevPosition;  // Keep the position at the end instead of resetting to 0
          }
          return prevPosition + 1;
        });
      }, 1000);
      setMediaInterval(newInterval);
    }
  };

  const onPause = () => {
    if (mediaInterval) {
      clearInterval(mediaInterval);
      setMediaInterval(null);
    }
  };

  const onStop = () => {
    onPause();
    onJumpToBegin();
    setShowPictures(false);  // Optionally hide pictures when stopped
  };

  const onJumpToBegin = () => {
    setPosition(0);
  };

  const onJumpToEnd = () => {
    setPosition(endPosition);
  };

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
        </nav>
      </div>
      <div className="content">
      <h1>Training</h1>
      <div>
        <button disabled={mediaInterval !== null} onClick={onPlay}>⏵</button>
        <button disabled={mediaInterval === null} onClick={onPause}>⏸</button>
        <button onClick={onJumpToBegin}>⏮</button>
        <button onClick={onJumpToEnd}>⏭</button>
        <button onClick={onStop}>⏹</button>
      </div>
      {showPictures && (
        <div key={layerData[position]?.id} className="layerContainer">
          <h2>{layerData[position]?.id}</h2>
          <div className="imagesContainer">
            {layerData[position]?.images.map((image, index) => (
              <div key={index} className="imageItem">
                <img src={image.url} alt={`${layerData[position]?.id} Image ${index + 1}`} />
                <p>{image.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      </div>
    </div>
    
  );
}

export default Training;
