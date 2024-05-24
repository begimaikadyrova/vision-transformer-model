import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import { TbPhotoSearch } from "react-icons/tb";
import { BsFillQuestionCircleFill } from "react-icons/bs";
import { IoAppsSharp } from "react-icons/io5";
import { FaRegChartBar } from "react-icons/fa";
import { BsDiagram3Fill } from "react-icons/bs";
import { PiTerminalWindow } from "react-icons/pi";

function HomePage() {
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
      <div className="homecontent">
        <h1>Explore Vision Transformer</h1>
        <div className="left-text">
          <div className="block-section">
            <section className="section">
              <h2>About ViT Visualizer</h2>
              <p style={{fontSize: "18px"}}><i>Welcome to the Vision Transformer visualization tool!</i></p>
                <p>This website is designed to help users understand how ViT models process images to make complex decisions.</p>
            </section>
            <div className="section-block">
              <h2>Explore Step-by-Step</h2>
              <p>
                <li><b>Patches</b> section shows how the ViT breaks down the image into manageable pieces.</li>
                <li><b>Training</b> section helps to understand how the model learns over time and adjusts its parameters accordingly.</li>
              </p>
            </div>
            <div className="section-block">
              <h2>Dynamic Visualization</h2>
              <p>
                <li><b>Graph</b> section illustrates the dynamic flow of attention across different image segments, helping to visualize the computational thinking of the ViT.</li>
                <li><b>Process</b> section allows you to monitor the overall performance and improvements of the model through various iterations.</li>
              </p>
            </div>
            <section className="section" style={{ marginBottom: '50px' }}>
              <h2>Hands-on Learning</h2>
              <p>
                This hands-on approach not only demystifies the complexity of Vision Transformers but also enhances your ability to manipulate and improve these models for more effective applications in real-world scenarios.
              </p>
            </section>
          </div>
       </div>  
      </div>
    </div>
  );
}

export default HomePage;