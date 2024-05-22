import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import { TbPhotoSearch } from "react-icons/tb";
import { BsFillQuestionCircleFill } from "react-icons/bs";
import { IoAppsSharp } from "react-icons/io5";
import { FaRegChartBar } from "react-icons/fa";
import { BsDiagram3Fill } from "react-icons/bs";
import { VscTerminal } from "react-icons/vsc";
import AnsiToHtml from 'ansi-to-html';

const convert = new AnsiToHtml({
  fg: '#000', 
  bg: '#fff', 
  newline: true, 
  escapeXML: true, 
  stream: false 
});

function Progress() {
  const [consoleOutput, setConsoleOutput] = useState('');
  const [eventSource, setEventSource] = useState(null);
  const [imageURL, setImageURL] = useState('');
  const consoleRef = useRef(null);

  const handleStart = () => {
    if (eventSource) {
      console.log("Attempted to start a new connection while one already exists.");
        return;
    }
    console.log("Starting new connection.");
    setConsoleOutput(prev => prev.replace('\nNo output yet...', ''));

    const source = new EventSource('http://localhost:5000/run_test');

    source.onmessage = function(event) {
      if (event.data === "END_OF_STREAM") {
        source.close();
        setEventSource(null);
        setConsoleOutput(prev => `${prev}\nTraining process has ended.`);
        setImageURL('http://localhost:5000/get_training_image');
        return;
      }
      const newOutput = convert.toHtml(event.data);
      setConsoleOutput(prev => `${prev}\n${newOutput}`);
    };
    

    
    source.onerror = function(event) {
      if (event.currentTarget.readyState === EventSource.CLOSED) {
        console.log('Connection was closed normally.');
      } else {
        console.error('An error occurred.');
        if (!eventSource) { 
          setConsoleOutput(prev => `${prev}${convert.toHtml('Failed to connect to server. Please check the connection or server status.')}`);
        }
      }
      source.close();
      setEventSource(null);
    };
  
    setEventSource(source);
  };


  useEffect(() => {
    const date = new Date();
    const formattedDate = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
    const initialOutput = `<div style="text-align: center;">Date: ${formattedDate}</div>\n\nNo output yet...`;
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
          <button className="button-train button--show" onClick={handleStart} >
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
          dangerouslySetInnerHTML={{ __html: consoleOutput }} 
        />
      {imageURL && (
          <div style={{ marginTop: '20px' }}>
            <img src={imageURL} alt="Training Result" style={{ width: '80%' }} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Progress;
