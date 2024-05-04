import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import { TbPhotoSearch } from "react-icons/tb";
import { BsFillQuestionCircleFill } from "react-icons/bs";
import { IoAppsSharp } from "react-icons/io5";
import { FaRegChartBar } from "react-icons/fa";
import { BsDiagram3Fill } from "react-icons/bs";
import { VscTerminal } from "react-icons/vsc";
import axios from 'axios';



function Progress() {

  // const [logs, setLogs] = useState([]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     axios.get('http://localhost:5000/get_logs')
  //       .then(response => {
  //         setLogs(response.data);
  //       })
  //       .catch(error => console.error('Error fetching logs:', error));
  //   }, 2000);  // Update every 2 seconds

  //   return () => clearInterval(interval);
  // }, []);

 
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
              <VscTerminal size={19}/>
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
      <h1>ViT Training Logs</h1>
      <div>
                {logs.map((log, index) => (
                    <p key={index}>{log}</p>
                ))}
            </div>
        </div>
    </div>
);
}



export default Progress;
