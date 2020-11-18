import React, { Component } from 'react';
import genderIcon from './genderIcon.png';
import axios from 'axios';
import './App.css';
import Iframe from 'react-iframe'

class App extends Component {
  state = {
    selectedFile: null,
    parsing: false,
    converted: false
  };

  // shouldComponentUpdate () {
  //   if (this.state.converted)
  //     return false;
  // }

  onChangeHandler=event=>{
    event.preventDefault();
    this.setState({selectedFile: event.target.files[0]});
  }

  onClickHandler = async e => {
    e.preventDefault();
    this.setState({parsing: true});

    const data = new FormData()
    data.append('file', this.state.selectedFile)
    axios.post('/api/upload', data, {})
    .then()
    .catch(function (error) {
      console.log(error);
    })
    .then(() => this.setState({parsing: false}))
    .then(() => this.setState({converted: true}))
  }

  onDownloadClickHandler = async () => {
    const response = await fetch('/api/download');
    const element = document.createElement("a");
    const blob = await response.blob();
    element.href = URL.createObjectURL(blob);
    const newName = this.state.selectedFile.name.replace('.txt', '.html');
    element.download = 'converted-' + newName;
    document.body.appendChild(element);
    element.click();
  }

  render() {
                                                          
  return (
    <div className="App">
      <header className="App-header">
        <img src={genderIcon} alt="symbol" style={{width: 50, height: 50, padding: 5}} />
        <div className="headerTitle">GenderBend</div>
      </header>
      <br />
      <div>
        <br />
        <input className="inputStyle" type="file" onChange={this.onChangeHandler} accept=".txt, .html"/>
        <button className="buttonStyle" type="button" onClick={this.onClickHandler}>Convert</button>
        <div>
          {this.state.parsing &&
            <p class="loading">loading</p>}
        </div>
      </div>
      <br />
      <div>
        {this.state.converted &&
          <div>
            <button className="buttonStyle" type="button" onClick={this.onDownloadClickHandler}>
              Download
            </button>
            <br /><br />
            <div className="iframeStyle">
              <Iframe url={process.env.PUBLIC_URL + "/genderbend.html"}
                width="100%"
                height="650px"
                id="myId"
                className="myClassname"
                display="initial"
                position="relative"/>
            </div>
          </div>
        }
      </div>
    </div>
  )};
}

export default App;
