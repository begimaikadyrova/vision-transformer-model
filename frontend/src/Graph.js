import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import { TbPhotoSearch } from "react-icons/tb";
import { BsFillQuestionCircleFill } from "react-icons/bs";
import { IoAppsSharp } from "react-icons/io5";
import { FaRegChartBar } from "react-icons/fa";
import { BsDiagram3Fill } from "react-icons/bs";
import { PiTerminalWindow } from "react-icons/pi";




function Graph() {
  const [loading, setLoading] = useState(true);

  const handleImageLoaded = () => {
    setLoading(false);
  };

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
      <div className="content">
        <h1>Graph</h1>
        <h2 style={{margin: '0'}}>Model Overview</h2>
        <p className="description">
          The graph visualization on this page is generated using the <code><b>pydot</b></code> library, which creates a directed graph of the model architecture. 
          <br></br>This visualization aids in understanding the complex structure of the Vision Transformer model.
        </p>
        <div className="graphpic">
          {loading ? (
            <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginLeft: '110px'}}>
              Please wait until the graph is generated...
              <img src="/loading-gif.gif" alt="Loading" style={{ width: '20px', height: '18px', marginLeft: '5px' }} />
            </p>
          ) : null}
          <img src="http://localhost:5000/get_graph_image" alt="Graph" onLoad={handleImageLoaded} />
        </div>
      </div>
    </div>
  );
}

export default Graph;