import React from 'react';
import './App.css';

function Training() {
  return (
    <div className="homePageContainer">
      <h1>Training</h1>
      <div className="imagesContainer"> 
        <img src="http://localhost:5000/get_image/dense_1_bias_0" alt="Dense 1 Bias" />
        <img src="http://localhost:5000/get_image/dense_1_kernel_0" alt="Dense 1 Kernel" />
      </div>
    </div>
  );
}


export default Training;
