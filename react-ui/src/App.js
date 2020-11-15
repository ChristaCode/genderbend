import React, { useState } from 'react';
import genderIcon from './genderIcon.png';
import axios from 'axios';
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [converted, setConverted] = useState(false);

  const onChangeHandler=event=>{
    setSelectedFile(event.target.files[0]);
  }

  const onClickHandler = async e => {
    e.preventDefault();
    setParsing(true);

    const data = new FormData()
    data.append('file', selectedFile)
    axios.post('/api/upload', data, {})
    .then()
    .catch(function (error) {
      console.log(error);
    })
    .then(() => setParsing(false))
    .then(() => setConverted(true))
  }

  const onDownloadClickHandler = async () => {
    const response = await fetch('/api/download');
    const element = document.createElement("a");
    const blob = await response.blob();
    element.href = URL.createObjectURL(blob);
    const newName = selectedFile.name.replace('.txt', '.html');
    element.download = 'converted-' + newName;
    document.body.appendChild(element);
    element.click();
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={genderIcon} alt="symbol" style={{width: 50, height: 50, padding: 5}} />
        <div className="headerTitle">GenderBend</div>
      </header>
      <br />
      <div>
        <br />
        <input className="inputStyle" type="file" onChange={onChangeHandler} accept=".txt, .html"/>
        <button className="buttonStyle" type="button" onClick={onClickHandler}>Convert</button>
        <div>
          {parsing &&
            <p class="loading">loading</p>}
        </div>
      </div>
      <br />
      <div>
        {converted &&
          <button className="buttonStyle" type="button" onClick={onDownloadClickHandler}>
            Download
          </button>
        }
      </div>
    </div>
  );
}

export default App;
