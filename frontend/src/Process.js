import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import { TbPhotoSearch } from "react-icons/tb";
import { BsFillQuestionCircleFill } from "react-icons/bs";
import { IoAppsSharp } from "react-icons/io5";
import { FaRegChartBar } from "react-icons/fa";
import { BsDiagram3Fill } from "react-icons/bs";
import { PiTerminalWindow } from "react-icons/pi";
import AnsiToHtml from 'ansi-to-html';

const convert = new AnsiToHtml({
  fg: '#000', 
  bg: '#fff', 
  newline: true, 
  escapeXML: true, 
  stream: false 
});

function Process() {
  const [consoleOutput, setConsoleOutput] = useState('');
  const [eventSource, setEventSource] = useState(null);
  const [imageURLs, setImageURLs] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isTraining, setIsTraining] = useState(false);
  const consoleRef = useRef(null);

  const handleStart = () => {
    const dataset = document.getElementById('dataset').value;
    if (eventSource) {
      console.log("Attempted to start a new connection while one already exists.");
        return;
    }
    console.log("Starting new connection with dataset: ", dataset);
    setConsoleOutput(prev => prev.replace('\nNo output yet...', ''));
    setImageURLs([]);
    setShowResults(false);
    setIsTraining(true);

    const source = new EventSource(`http://localhost:5000/run_test/${dataset}`);

    source.onmessage = function(event) {
      if (event.data === "END_OF_STREAM") {
        source.close();
        setEventSource(null);
        setConsoleOutput(prev => `${prev}\nTraining process has ended.`);
        fetchImages();
        setIsTraining(false);
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
      setIsTraining(false);
    };
  
    setEventSource(source);
  };

  const fetchImages = () => {
    fetch('http://localhost:5000/get_training_images')
      .then(response => response.json())
      .then(data => {
        const urls = data.map(item => `data:image/png;base64,${item}`);
        setImageURLs(urls);
        setShowResults(true);
      })
      .catch(error => {
        console.error('Error fetching images:', error);
      });
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
          <Link to="/process">
            <span className="nav-item active">
              <PiTerminalWindow size={21} />
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
          <button className="button-train button--show" onClick={handleStart} disabled={isTraining}>
            <span>{isTraining ? 'Training in Progress...' : 'Start Training'}</span>
          </button>
          <div> Choose a dataset: </div>
          <select id='dataset'>
            <option value={'cifar10'}>CIFAR10</option>
            <option value={'cifar100'}>CIFAR100</option>
            <option value={'mnistdigits'}>MNIST digits </option>
            <option value={'fashionmnist'}>Fashion MNIST</option>
          </select>
        </div>
        <div
          ref={consoleRef}
          className="console"
          style={{
            backgroundColor: '#000',
            color: '#fff',
            fontFamily: 'monospace',
            marginTop: '10px',
            padding: '10px',
            whiteSpace: 'pre-wrap',
            width: '80%',
            height: '600px',
            overflowY: 'scroll',
          }}
          dangerouslySetInnerHTML={{ __html: consoleOutput }} 
        />
        {showResults && (
          <>
            <h3 style={{ marginTop: '40px', marginBottom: '40px' }}>Training results</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '80%' }}>
              {imageURLs.map((url, index) => (
                url && (
                  <div key={index} style={{ width: '49%' }}>
                    <img src={url} alt={`Training Result ${index}`} style={{ width: '100%' }} />
                    {index === 0 && (
                      <ul style={{marginTop: '30px'}}>
                        <li><b>Train Loss: </b>Indicates the loss on the training dataset, which usually decreases as the model learns.</li>
                        <br></br>
                        <br></br>
                        <li><b>Validation Loss: </b>Indicates the validation dataset loss, helping monitor the model's generalization to unseen data. Ideally, validation loss should decrease similarly to training loss, suggesting the model isn't overfitting.</li>
                      </ul>
                    )}
                    {index === 1 && (
                      <ul style={{marginTop: '30px'}}>
                        <li><b>Train Top-5 Accuracy: </b>Represents the model's top-5 accuracy on the training dataset. It generally increases as the model learns from the training data.</li>
                        <br></br>
                        <li><b>Validation Top-5 Accuracy: </b>Shows the top-5 accuracy on the validation dataset, indicating how well the model performs on unseen data. A similar upward trend to the train top-5 accuracy line suggests good generalization performance.</li>
                      </ul>
                    )}
                  </div>
                )
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Process;
