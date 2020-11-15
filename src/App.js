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
  
  handleSubmit = async e => {
    e.preventDefault();
    const response = await fetch('/api/world', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ post: this.state.post }),
    });
    const body = await response.text();
    
    this.setState({ responseToPost: body });
  };

  onChangeHandler=event=>{
    this.setState({
      selectedFile: event.target.files[0]
    })
  }

  onClickHandler = async e => {
    e.preventDefault();
    this.setState({ parsing: true });

    const data = new FormData()
    data.append('file', this.state.selectedFile)
    axios.post('/api/upload', data, {})
    .then()
    .catch(function (error) {
      console.log(error);
    })
    .then(() => this.setState({ parsing: false, converted: true }))
  }

  onDownloadClickHandler = async () => {
    console.log('selectedFile', this.state.selectedFile.name);
    const response = await fetch('/api/download');
    const element = document.createElement("a");
    const blob = await response.blob();
    element.href = URL.createObjectURL(blob);
    element.download = 'converted-' + this.state.selectedFile.name;
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
          <input className="inputStyle" type="file" onChange={this.onChangeHandler} accept=".txt"/>
          <button className="buttonStyle" type="button" onClick={this.onClickHandler}>Convert</button>
          <div>
            {this.state.parsing &&
              <p class="loading">loading</p>}
          </div>
        </div>
        <br />
        <div>
          {this.state.converted &&
            <button className="buttonStyle" type="button" onClick={this.onDownloadClickHandler}>
              Download
            </button>
          }
        </div>
      </div>
    );
  }
}

export default App;