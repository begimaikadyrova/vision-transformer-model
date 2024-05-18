import React, { useState, useEffect, useRef } from 'react';
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
  const [trainingStarted, setTrainingStarted] = useState(false);
  const consoleRef = useRef(null);

  const handleStart = () => {
    if (eventSource) return;

    const source = new EventSource('http://localhost:5000/run_test');

    source.onmessage = function(event) {
      setTrainingStarted(true);
      setConsoleOutput(prev => prev + '\n' + event.data);
    };

    source.onerror = function(event) {
      console.error('EventSource failed:', event);
      setConsoleOutput(prev => prev + '\nFailed to connect to server.');
      source.close();
      setEventSource(null);
    };

    setTrainingStarted(true);
    setConsoleOutput(prev => prev.replace('No output yet...', '').trim());
    setEventSource(source);
  };

  useEffect(() => {
    const date = new Date();
    const formattedDate = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
    const initialOutput = `Date: ${formattedDate}\n\nNo output yet...`;
    setConsoleOutput(initialOutput);
  }, []);

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [consoleOutput]);

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
              <span>Process</span>
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
          <button className="button-train button--show" onClick={handleStart}>
            <span>Start Training</span>
          </button>
        </div>
        <div
          ref={consoleRef}
          className="console"
          style={{
            backgroundColor: '#000',
            color: '#fff',
            fontFamily: 'monospace',
            padding: '10px',
            whiteSpace: 'pre-wrap',
            width: '80%',
            height: '600px',
            overflowY: 'scroll',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            {consoleOutput.split('\n')[0]}
          </div>
          <div style={{ textAlign: 'center', whiteSpace: 'pre-wrap' }}>
            {'\n'}
          </div>
          {!trainingStarted ? (
            <div style={{ textAlign: 'center' }}>
              No output yet...
            </div>
          ) : (
            <div style={{ textAlign: 'center', whiteSpace: 'pre-wrap' }}>
              Training process has started...
            </div>
          )}
          {trainingStarted && (
            <div style={{ textAlign: 'left' }}>
              {consoleOutput.split('\n').slice(1).join('\n')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Progress;
