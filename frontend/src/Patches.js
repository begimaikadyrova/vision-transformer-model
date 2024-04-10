import React, { useState, useEffect, useRef} from 'react';
import './App.css';



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
    <div className="homePageContainer">
      <h1>Patches</h1>
      <div className="imagesContainer"> {}
        {patchImages.map((src, index) => (
          <img key={index} src={`data:image/png;base64,${src}`} alt={`Patch ${index}`} />
        ))}
      </div>
      {texts.map((text, index) => (
        <p key={index} className="customFont">{text}</p>
      ))}
    </div>
  );
}

export default Patches;

