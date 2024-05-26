import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import './App.css';
import { TbPhotoSearch } from "react-icons/tb";
import { BsFillQuestionCircleFill } from "react-icons/bs";
import { IoAppsSharp } from "react-icons/io5";
import { FaRegChartBar } from "react-icons/fa";
import { BsDiagram3Fill } from "react-icons/bs";
import { PiTerminalWindow } from "react-icons/pi";
import { FaArrowCircleRight } from "react-icons/fa";





function Patches() {
  const [patchImages, setPatchImages] = useState([]);
  const [texts, setTexts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showImages, setShowImages] = useState(false);
  const [showDescription, setShowDescription] = useState(true);
  const [error, setError] = useState('');
  const [dataset, setDataset] = useState('cifar10');

  const fetchImages = (selectedDataset) => {
    setLoading(true);
    setShowDescription(false);
    setShowImages(false);
    fetch(`http://localhost:5000/patchess/${selectedDataset}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setPatchImages(data.images);
        setTexts(data.text);
        setLoading(false);
        setShowImages(true);  
        setError('');
      })
      .catch(error => {
        setLoading(false);
        setError(`There was a problem with the fetch operation: ${error.message}`);
      });
  };

  const toggleImages = () => {
    setShowImages(!showImages);
    setShowDescription(!showDescription);
  };

  const handleDatasetChange = (selectedOption) => {
    setDataset(selectedOption.value);
  };

  const datasetOptions = [
    { value: 'cifar10', label: 'CIFAR10' },
    { value: 'cifar100', label: 'CIFAR100' },
    { value: 'mnistdigits', label: 'MNIST digits' },
    { value: 'fashionmnist', label: 'Fashion MNIST' }
  ];


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
          <Link to="/process">
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
        <h1>Patches</h1>
        <h3>Understanding Patches in Vision Transformer</h3>
        {error && (
        <div className='error-message'>{error}</div>
      )}
        {showDescription && (
          <>
            <div className='patchespage'>
              <p className="centered-text" style={{lineHeight: "2", marginTop: "0"}}>
              Explore how Vision Transformers split images into small, manageable segments known as patches.
              <br></br>
                Each patch plays a crucial role in the model's understanding of the entire image.
                </p>

              <p><b>Click on the button below</b> to view how Vision Transformers preprocess visuals by breaking them into patches.
              </p>
            </div>
          </>
        )}
         <div>
          <h3>Choose a dataset: </h3>
        </div>
        <div>
          <Select
            placeholder="Select a dataset"
            className="select-box"
            value={datasetOptions.find(option => option.value === dataset)}
            onChange={handleDatasetChange}
            options={datasetOptions}
            styles={{
              menuList: (provided) => ({
                ...provided,
                maxHeight: 'none',
                overflow: 'visible',
                paddingTop: 0,
                paddingBottom: 0
              }),
              menu: (provided) => ({
                ...provided,
                marginTop: 3,
                borderRadius: 0,
              }),
              control: (base, state) => ({
                ...base,
                backgroundColor: "#8494ac",
                width: 280,
                borderRadius: 0,
                height: 45,
                color: "white",
                borderColor: state.isFocused ? '#f0f0f034' : 'grey',
                boxShadow: state.isFocused ? '0 0 0 1px #f0f0f034' : 'none',
                '&:hover': {
                  borderColor: '#272d3a'
                }
              }),
              option: (styles, { isFocused, isSelected }) => ({
                ...styles,
                height: 45,
                margin: 0,
                backgroundColor: isSelected ? 'darkgray' : isFocused ? 'lightgray' : undefined,
                color: 'black',
              }),
              singleValue: (base) => ({
                ...base,
                color: '#272d3a',
                fontWeight: 'bold'
              }),
              placeholder: (base) => ({
                ...base,
                color: '#272d3a',
              }),
              noOptionsMessage: (base) => ({
                ...base,
                height: 45,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'black',
              }),
            }}
            noOptionsMessage={() => "No options"}
          />
        </div>
         {!loading && showImages && (
          <button className="button button--show" onClick={toggleImages} style={{ marginBottom: '10px', marginTop: '20px' }}>
            <span>Hide Images</span>
          </button>
        )}
        {loading && (
          <div className='centerParagraph'>
            <p style={{ fontSize: '18px' }}>Images are being processed, please wait a moment...<img src="/loading-gif.gif" alt="Loading" style={{ width: '20px', height: '18px', marginLeft: '5px' }} /></p>
          </div>
        )}
        {!loading && showImages && (
          <>
            <button className="button button--show" onClick={() => fetchImages(dataset)} style={{ marginBottom: '10px', marginTop: '10px' }}>
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}> Next Images
                <FaArrowCircleRight size={22} style={{ marginLeft: '5px' }} />
              </span>
            </button>

            <div className="imagesContainer">
              {patchImages.map((src, index) => (
                <img key={index} src={`data:image/png;base64,${src}`} alt={`Patch ${index}`} />
              ))}
            </div>
            {texts.map((text, index) => (
              <b><p key={index} className="customFont">{text}</p></b>
            ))}
          </>
        )}
         {!showImages && !loading && (
          <div className="centerContainer">
            <button className="button button--show" onClick={() => fetchImages(dataset)}>
              <span>Show Images</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Patches;