import React, { useState, useEffect, useRef} from 'react';
import './App.css';

function Training() {
  const initialized = useRef(false)
  const [allLayers, setAllLayers] = useState([]);

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
        console.log(data);
        const processedContent = Object.entries(data.layer_weights).map(([key, value], index) => {
          
          return {
            id: key, // Using the key as a unique identifier
            label: `Layer ${key}`, // Using the key for the label, adjust as needed
            images: value.map(image => 
              `http://localhost:5000/get_image/${image.replace(/\//g, '_')}_0`)
          };
        });

        setAllLayers(processedContent);
        //data.layer_weight 
        // go through all of it and convert slash to underscore and then request the image
         // generate div with H1 put labels in h1 and put a bunch of images // you need to generate it dynamically

      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
}}, []);


  return (
    <div className="homePageContainer">
      <h1>Training</h1>
      <div className="imagesContainer"> 
      {allLayers.map((content) => (
          <div key={content.id}>
            <p>{content.label}</p>
            {content.images.map((imageUrl, index) => (
              <img key={index} src={imageUrl} alt={`${content.label} Image ${index + 1}`} style={{ margin: "10px" }}/>
            ))}
          </div>
        ))}
    

        {/* <img src="http://localhost:5000/get_image/dense_1_bias_0" alt="Dense 1 Bias" />
        <img src="http://localhost:5000/get_image/dense_1_kernel_0" alt="Dense 1 Kernel" /> */}
      </div>

    </div>
  );
}


export default Training;
