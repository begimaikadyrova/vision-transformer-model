import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function Training() {
  const initialized = useRef(false);
  const [layerData, setLayerData] = useState([]);
  const [position, setPosition] = useState(0);
  const [endPosition, setEndPosition] = useState(0);
  const [mediaInterval, setMediaInterval] = useState(null);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
    // Fetch the data from the Flask server
    fetch('http://localhost:5000/graph') // assuming you're on the same host
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Process only layers with images
        const layersWithImages = Object.entries(data.layer_weights).reduce((acc, [key, value]) => {
          if (value.length > 0) { // Only include layers that have images
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
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
  }}, []);
const onPlay = () => {
  setMediaInterval(setInterval(() => {
    setPosition((position) => {
      if (position === endPosition) {
        clearInterval(mediaInterval);
        return 0;
      }
      return position + 1;
    });
  }, 1000));
};

const onPause = () => {
  clearInterval(mediaInterval);
  setMediaInterval(null);
}

const onStop = () => {
  onPause();
  onJumpToBegin()
}

const onJumpToBegin = () => {
  onPause();
  setPosition(0);
}

const onJumpToEnd = () => {
  onPause();
  setPosition(endPosition);
}


  return (
    <div className="trainingContainer">
      <h1>Training</h1>
      <div>
        <button disabled = {mediaInterval !== null} onClick={event => onPlay() }>⏵</button>
        <button disabled = {mediaInterval === null} onClick={event => onPause()} >⏸</button>
        <button onClick={event => onJumpToBegin()}>⏮</button>
        <button onClick={event => onJumpToEnd()}>⏭</button>
        <button onClick={event => onStop()}>⏹</button>
        
      
      </div>
      {layerData.map((layer) => (
        <div key={layer.id} className="layerContainer">
          <h2>{layer.id}</h2>
          <div className="imagesContainer">
            {layer.images.map((image, index) => (
              <div key={index} className="imageItem">
                <img src={image.url} alt={`${layer.label} ${index + 1}`} />
                <p>{`${image.label}`}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Training;
