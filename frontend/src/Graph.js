import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import { TfiLayoutGrid3Alt } from "react-icons/tfi";
import { MdDisplaySettings } from "react-icons/md";
import { BsFillDiagram2Fill } from "react-icons/bs";

function Graph() {
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
      <h1>Graph</h1>
        <img src="http://localhost:5000/get_graph_image" alt="Graph" />
    </div>
    </div>
    
  );
}


export default Graph;
