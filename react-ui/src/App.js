import React, { Component } from 'react';
import genderIcon from './genderIcon.png';
import axios from 'axios';
import './App.css';

class App extends Component {
  state = {
    selectedFile: null,
    parsing: false,
    converted: false
  };

  componentWillMount () {
    const script = document.createElement("script");

    script.src = "https://www.riddle.com/files/js/embed.js";
    script.async = true;

    document.body.appendChild(script);
  }

  onChangeHandler=event=>{
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
    const divStyle = {
          margin: "0 auto",
          maxWidth: "100%",
          width: "1300px"
        };

    const iframeStyle = {
          margin: "0 auto",
          maxWidth: "100%",
          width: "100%",
          height: "500px",
          border: "2px solid #655469"
        };

    const riddleID = "120064";

    let newName = '';
    if(this.state.converted) {
      newName = this.state.selectedFile.name.replace('.txt', '.html');
    }
    const riddleUrl = "../../uploadedFile/" + newName;
    console.log('riddleUrl', riddleUrl);
                                                          
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
            <div className="riddle_target" data-rid-id={riddleID} data-fg="#252525" data-bg="#EDEDED" style={divStyle} data-auto-scroll="true">
              <iframe title="embed-test" style={iframeStyle} src={riddleUrl}></iframe>
            </div>
          </div>
        }
      </div>
    </div>
  )};
}

export default App;
