import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import { Link } from 'react-router-dom';
import './App.css';
import { TbPhotoSearch } from "react-icons/tb";
import { BsFillQuestionCircleFill } from "react-icons/bs";
import { IoAppsSharp } from "react-icons/io5";
import { FaRegChartBar } from "react-icons/fa";
import { BsDiagram3Fill } from "react-icons/bs";
import { VscTerminal } from "react-icons/vsc";




function Training() {
  const initialized = useRef(false);
  const [layerData, setLayerData] = useState([]);
  const [selectedLayer, setSelectedLayer] = useState(null);
  const [position, setPosition] = useState(0);
  const [mediaInterval, setMediaInterval] = useState(null);
  const [showPictures, setShowPictures] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      fetch('http://localhost:5000/graph')
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          let layersWithImages = [];
        
          Object.entries(data.layer_weights).forEach(([key, values]) => {
            if (values.length > 0) {
              if (key === 'multi_head_attention') {
                const suffixes = ['attention_output', 'key', 'query', 'value'];
                suffixes.forEach(suffix => {
                  if (suffix) {
                    const valueImages = ['kernel', 'bias'].map(subKey => ({
                      label: `${key}/${suffix}/${subKey}`,
                      urls: Array.from({ length: 176 }, (_, i) => `http://localhost:5000/get_image/${key}_${suffix}_${subKey}_${i}`)
                    }));
                    layersWithImages.push({
                      id: `${key}_${suffix}`,
                      images: valueImages
                    });
                  } else {
                    const images = [{
                      label: `${key}/${suffix}`,
                      urls: Array.from({ length: 176 }, (_, i) => `http://localhost:5000/get_image/${key}_${suffix}_${i}`)
                    }];
                    layersWithImages.push({
                      id: `${key}_${suffix}`,
                      images: images
                    });
                  }
                });
              } else {
                const images = values.map(value => ({
                  label: value,
                  urls: Array.from({ length: 176 }, (_, i) => `http://localhost:5000/get_image/${value.replace(/\//g, '_')}_${i}`)
                }));
                layersWithImages.push({
                  id: key,
                  images: images
                });
              }
            }
          });
        
          setLayerData(layersWithImages.map(layer => ({
            value: layer.id,
            label: layer.id, 
            images: layer.images
          })));
        
          if (layersWithImages.length > 0) {
            setSelectedLayer({ value: layersWithImages[0].id, label: layersWithImages[0].id.replace(/_/g, ' ') });
          }
        })
        .catch(error => {
          console.error('There was a problem with the fetch operation:', error);
        });
    }
  
    return () => {
      if (mediaInterval) {
        clearInterval(mediaInterval);
      }
    };
  }, [mediaInterval]);
  

  const openModal = (url) => {
    setSelectedImage(url);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  

  const onPlay = () => {
    setShowPictures(true);
    if (!mediaInterval) {
      const newInterval = setInterval(() => {
        setPosition(prevPosition => {
          if (prevPosition >= 175) {
            clearInterval(newInterval);
            return prevPosition;
          }
          return prevPosition + 1;
        });
      }, 1000);
      setMediaInterval(newInterval);
    }
  };

  const onPause = () => {
    if (mediaInterval) {
      clearInterval(mediaInterval);
      setMediaInterval(null);
    }
  };

  const onStop = () => {
    onPause();
    setPosition(0);
    setShowPictures(false);
  };

  const onJumpToBegin = () => {
    setPosition(0);
  };

  const onJumpToEnd = () => {
    setPosition(175);
  };

  const handleLayerChange = selectedOption => {
    setSelectedLayer(selectedOption);
    setPosition(0); 
    setShowPictures(false);
    if (mediaInterval) { 
      clearInterval(mediaInterval);
      setMediaInterval(null); 
    }
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
        <h1>Training</h1>
        <h3> Explore how the model learns over time and adjusts its parameters accordingly</h3> 
        <div className='explore'>

        </div>
        <p style={{fontSize: "17px"}}>Please, choose a <i><strong>layer</strong></i> to see how the model's weights change over the time</p>
        <div className='selectMenu'>
          <Select placeholder="Please, select a layer"
            className="select-box"
            value={selectedLayer}
            onChange={handleLayerChange}
            options={layerData}
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
                backgroundColor: "#181c24",
                width: 346,
                borderRadius: 0,  
                height: 45,
                color: "white",
                borderColor: state.isFocused ? '#f0f0f034' : 'grey', 
                boxShadow: state.isFocused ? '0 0 0 1px #f0f0f034' : 'none',
                '&:hover': {
                  borderColor: 'darkgrey' 
               }
              }),
              option: (styles, { isFocused, isSelected }) => {
                return {
                  ...styles,
                  height: 45,
                  margin: 0,
                  backgroundColor: isSelected ? 'darkgray' : isFocused ? 'lightgray' : undefined,
                  color: 'black', 
                };
              },
              singleValue: (base) => ({
                ...base,
                color: 'white',
              }),
              placeholder: (base) => ({
                ...base,
                color: 'white',  
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
            noOptionsMessage={() => "Layers are loading..."}
          />

        </div>



        {selectedLayer && (
        <div className='mediaControls'>
          <button className='mediaButton' disabled={mediaInterval !== null} onClick={onPlay} title="Click on the play button to see the model's weights change over time">⏵</button>
          <button className='mediaButton' disabled={mediaInterval === null} onClick={onPause} title="Click on the pause button to stop the animation">⏸</button>
          <button className='mediaButton' onClick={onJumpToBegin} title="Click on the jump to begin button to go to the first image">⏮</button>
          <button className='mediaButton' onClick={onStop}>⏹</button>
          <button className='mediaButton' onClick={onJumpToEnd} title="Click on the jump to end button to go to the last image">⏭</button>
        </div>
        )}
        {showPictures && (
        <p>You can click on the image to see an original version</p>
      )}
        {showPictures && (
          <div className="layerContainer">
            <h2>Layer: {selectedLayer?.label}</h2>
            <div className="imagesContainer">
            {layerData.find(layer => layer.value === selectedLayer?.value)?.images.map((image, index) => (
                <div className="imagesContainer" key={index}>
                  <img src={image.urls[position]} alt={`${selectedLayer.label} ${position + 1} ${image.label}`}
                       onClick={() => openModal(image.urls[position])} />
                  <p>{image.label}</p>
                </div>
              ))}
            </div>
          </div>
        )} 
        

      </div>
      {isModalOpen && (
        <div className="modal" onClick={closeModal}>
          <img src={selectedImage} alt="Original model weight" />
          <button onClick={closeModal}>Close</button>
        </div>
      )}
    </div>
  );
}

export default Training;