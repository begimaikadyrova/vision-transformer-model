import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import { Link } from 'react-router-dom';
import './App.css';
import { TfiLayoutGrid3Alt } from "react-icons/tfi";
import { MdDisplaySettings } from "react-icons/md";
import { BsFillDiagram2Fill } from "react-icons/bs";
import { VscServerProcess } from "react-icons/vsc";
import { LiaHomeSolid } from "react-icons/lia";



function Training() {
  const initialized = useRef(false);
  const [layerData, setLayerData] = useState([]);
  const [selectedLayer, setSelectedLayer] = useState('');
  const [position, setPosition] = useState(0);
  const [mediaInterval, setMediaInterval] = useState(null);
  const [showPictures, setShowPictures] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  

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
          const layersWithImages = Object.entries(data.layer_weights).reduce((acc, [key, values]) => {
            if (values.length > 0) {
              const images = values.map(value => ({
                label: value,
                urls: Array.from({ length: 176 }, (_, i) => `http://localhost:5000/get_image/${value.replace(/\//g, '_')}_${i}`)
              }));
  
              acc.push({
                id: key,
                images: images // Now includes all images, e.g., both kernel and bias for each layer
              });
            }
            return acc;
          }, []);
  
          setLayerData(layersWithImages);
          if (layersWithImages.length > 0) {
            setSelectedLayer(layersWithImages[0].id);
          }
        })
        .catch(error => {
          console.error('There was a problem with the fetch operation:', error);
        });
    }
  
    return () => {
      if (mediaInterval) {
        clearInterval(mediaInterval);
      }
    };
  }, [mediaInterval]);

  const openModal = (url) => {
    setSelectedImage(url);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  

  const onPlay = () => {
    setShowPictures(true);
    if (!mediaInterval) {
      const newInterval = setInterval(() => {
        setPosition(prevPosition => {
          if (prevPosition >= 175) { // max index of images
            clearInterval(newInterval);
            return prevPosition;
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
    setPosition(0);
    setShowPictures(false);
  };

  const onJumpToBegin = () => {
    setPosition(0);
  };

  const onJumpToEnd = () => {
    setPosition(175);
  };

  const handleLayerChange = (event) => {
    setSelectedLayer(event.target.value);
    setPosition(0);
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
        <h1>Training</h1>
        <p>Explore how the model learns over time and adjusts its parameters accordingly.</p>
        <p>Choose a layer to see how the model's weights change over time.</p>
        <div className='selectMenu'>
        <select className="select-box" value={selectedLayer} onChange={handleLayerChange}>
        {layerData.map(layer => (
        <option key={layer.id} value={layer.id}>{layer.id}</option>
        ))}
        </select>
        </div>


        <p>Click on the play button to see the model's weights change over time.</p>
        <p>Click on the pause button to stop the animation.</p>
        <p>Click on the stop button to reset the animation.</p>
        <p>Click on the jump to begin button to go to the first image.</p>
        <p>Click on the jump to end button to go to the last image.</p>
        <p>Click on the image to see a larger version.</p>
        <p>Click on the label to see the image's description.</p>

      
        <div>
          <button disabled={mediaInterval !== null} onClick={onPlay}>⏵</button>
          <button disabled={mediaInterval === null} onClick={onPause}>⏸</button>
          <button onClick={onJumpToBegin}>⏮</button>
          <button onClick={onJumpToEnd}>⏭</button>
          <button onClick={onStop}>⏹</button>
        </div>
        {showPictures && (
          <div className="layerContainer">
            <h2>{selectedLayer}</h2>
            <div className="imagesContainer">
              {layerData.find(layer => layer.id === selectedLayer)?.images.map((image, index) => (
                <div className="imagesContainer" key={index}>
                  <img src={image.urls[position]} alt={`${selectedLayer} Image ${position + 1} ${image.label}`}
                       onClick={() => openModal(image.urls[position])} />
                  <p>{image.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {isModalOpen && (
        <div className="modal" onClick={closeModal}>
          <img src={selectedImage} alt="Enlarged model weight" />
          <button onClick={closeModal}>Close</button>
        </div>
      )}
    </div>
  );
}

export default Training;