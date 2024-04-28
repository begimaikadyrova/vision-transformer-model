import { Link } from 'react-router-dom';
import './App.css';
import { TfiLayoutGrid3Alt } from "react-icons/tfi";
import { MdDisplaySettings } from "react-icons/md";
import { BsFillDiagram2Fill } from "react-icons/bs";
import { VscServerProcess } from "react-icons/vsc";
import { LiaHomeSolid } from "react-icons/lia";



function Progress() {
 
  return (
    <div className="App">
      <div className="sidebar">
        <nav>
        <Link to="/">
            <span className="nav-item">
            <LiaHomeSolid />
              <span>Main</span>
            </span>
          </Link>
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
          <Link to="/progress">
            <span className="nav-item">
            <VscServerProcess />
              <span>Process</span>
            </span>
          </Link>
        </nav>
      </div>
      <div className="content">
            <h1>Vision Transformer Model</h1>
        </div>
    </div>
);
}

export default Progress;
