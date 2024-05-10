import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import { TbPhotoSearch } from "react-icons/tb";
import { BsFillQuestionCircleFill } from "react-icons/bs";
import { IoAppsSharp } from "react-icons/io5";
import { FaRegChartBar } from "react-icons/fa";
import { BsDiagram3Fill } from "react-icons/bs";
import { VscTerminal } from "react-icons/vsc";

function Progress() {
  const [consoleOutput, setConsoleOutput] = useState('');
  const [eventSource, setEventSource] = useState(null);

  const handleStart = () => {
    if (!eventSource) {
      const source = new EventSource('http://localhost:5000/run_test');
      
      source.onmessage = function(event) {
        setConsoleOutput(prev => prev + '\n' + event.data);
      };

      source.onerror = function(event) {
        console.error('EventSource failed:', event);
        setConsoleOutput(prev => prev + '\nFailed to connect to server.');
        source.close();
        setEventSource(null);
      };

      setEventSource(source);
    }
  };

  const handleStop = () => {
    if (eventSource) {
      eventSource.close();
      setEventSource(null);
    }
  };

  // Clean up EventSource when the component is unmounted
  useEffect(() => {
    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [eventSource]);

  return (
    <div className="App">
      <div className="sidebar">
        <nav className="nav-main">
          <span className="nav-title">
            <TbPhotoSearch size={19} />
            <span><b>Vision Transformer</b></span>
          </span>
          <div className="nav-divider"></div>

          <Link to="/patches">
            <span className="nav-item">
              <IoAppsSharp size={18} />
              <span>Patches</span>
            </span>
          </Link>
          <Link to="/training">
            <span className="nav-item">
              <FaRegChartBar size={19} />
              <span>Training</span>
            </span>
          </Link>
          <Link to="/graph">
            <span className="nav-item">
              <BsDiagram3Fill size={19} />
              <span>Graph</span>
            </span>
          </Link>
          <Link to="/progress">
            <span className="nav-item active">
              <VscTerminal size={19} />
              <span>Progress</span>
            </span>
          </Link>
        </nav>
        <div className="nav-footer">
          <Link to="/">
            <span className="nav-item">
              <BsFillQuestionCircleFill size={19} />
              <span>About Tool</span>
            </span>
          </Link>
        </div>
      </div>
      <div className="content">
        <h1>ViT Training Logs</h1>
        <div style={{ marginBottom: '20px' }}>
          <button onClick={handleStart} style={{ marginRight: '10px' }}>Start</button>
          <button onClick={handleStop}>Stop</button>
        </div>
        <div
          className="console"
          style={{
            backgroundColor: '#000',
            color: '#fff',
            fontFamily: 'monospace',
            padding: '10px',
            whiteSpace: 'pre-wrap',
            width: '80%',
            height: '600px',
            overflowY: 'scroll'
          }}
        >
          {consoleOutput || "No output yet..."}
        </div>
      </div>
    </div>
  );
}

export default Progress;
