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
    downloadedFile: null
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
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    })
    .then(() => this.setState({ parsing: false }))
  }

  onDownloadClickHandler = async () => {
    const element = document.createElement("a");
    const response = await fetch('/api/download');
    console.log('response', response);
    console.log('response.data', response.data);
    const blob = await response.blob();
    console.log('blob', blob);
    element.href = URL.createObjectURL(blob);
    element.download = "myFile.txt";
    document.body.appendChild(element);
    element.click();
    // fileDownload(response, 'test.txt');

    // this.setState({downloadedFile: true});

    // const body = await response.json();
    // console.log('body', body);
    // if (response.status !== 200) throw Error(body.message);

    // return body;
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
              height={100}
              width={100}
            />}
        </div>
        <br />
        {!this.state.parsing && 
          <button type="button" onClick={this.onDownloadClickHandler}>
            Download
            {/* <a href={this.state.downloadedFile} download>Download</a> */}
          </button>
        }
      </div>
    );
  }
}

export default App;