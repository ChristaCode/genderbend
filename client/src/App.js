import React, { Component } from 'react';
import Loader from 'react-loader-spinner';
import female from './female.png';
import male from './male.png';
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
        <span>
        <img src={male} alt="male" style={{width: 30, height: 30}} />
        <span style={{padding: 5}}>GenderBend</span>
        <img src={female} alt="female" style={{width: 20, height: 20}} />
        </span>
        </header>
        <br />
        <div>
          <input type="file" name="file" onChange={this.onChangeHandler}/>
          <button type="button" onClick={this.onClickHandler}>Convert</button>
          {this.state.parsing &&
            <Loader
              type="ThreeDots"
              color="#00BFFF"
              height={50}
              width={50}
            />}
        </div>
        <br />
        <br />
        {this.state.converted && 
          <button type="button" onClick={this.onDownloadClickHandler}>
            Download
          </button>
        }
      </div>
    );
  }
}

export default App;