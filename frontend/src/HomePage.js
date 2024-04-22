import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import { TfiLayoutGrid3Alt } from "react-icons/tfi";
import { MdDisplaySettings } from "react-icons/md";
import { BsFillDiagram2Fill } from "react-icons/bs";
import { VscServerProcess } from "react-icons/vsc";
import { LiaHomeSolid } from "react-icons/lia";

function HomePage() {
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
      <div className="homecontent">
        <h1>Explore Vision Transformer</h1>
        <div className='centered-text'>
        <p>Welcome to the Vision Transformer (ViT) visualization tool! This website is designed to help users understand how ViT models, 
          particularly their attention layers, process images to make complex decisions. 
        By exploring this step-by-step process of a Vision Transformer model as it interprets different parts of an image using the mechanism of attention. 
        This educational platform is tailored for students, researchers, and practitioners in computer vision.</p>
        <br></br>
        <p>Start by selecting an image data source from the "Patches" section to see how the ViT breaks down the image into manageable pieces. 
          Progress to the "Training" section to understand how the model learns over time and adjusts its parameters accordingly. 
          The "Graph" section illustrates the dynamic flow of attention across different image segments, helping to visualize the computational thinking of the ViT. 
          Finally, the "Process" section allows you to monitor the overall performance and improvements of the model through various iterations.</p>
          <br></br>
        <p>This hands-on approach not only demystifies the complexity of Vision Transformers but also enhances your ability to 
          manipulate and improve these models for more effective applications in real-world scenarios.</p>
        </div>
      </div>
   </div>
  );
}

export default HomePage;