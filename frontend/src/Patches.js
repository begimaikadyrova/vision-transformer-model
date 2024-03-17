import React, { useState, useEffect } from 'react';

function Patches() {
  const [patchImages, setPatchImages] = useState([]);
  const [text, setTexts] = useState([]);

  useEffect(() => {
    fetch('/patches')
      .then(response => response.text())
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const images = doc.querySelectorAll('img');
        const paragraphs = doc.querySelectorAll('p');
        setPatchImages(Array.from(images).map(img => img.src));
        setTexts(Array.from(paragraphs).map(p => p.textContent));
      });
  }, []);

  return (
    <div>
      <h1>Patches</h1>
      {patchImages.map((src, index) => (
        <img key={index} src={`data:image/png;base64,${src}`} alt={`Patch ${index}`} />
      ))}
      {Array.isArray(text) ? text.map((t, index) => (
        <p key={index}>{t}</p>
      )) : <p>{text}</p>}
    </div>
  );
}

export default Patches;
