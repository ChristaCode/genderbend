import React, { Component } from 'react';
import Loader from 'react-loader-spinner';
import female from './female.png';
import male from './male.png';
import './App.css';

class App extends Component {
  state = {
    response: '',
    post: '',
    responseToPost: '',
    selectedFile: null,
    parsing: false
  };
  
  componentDidMount() {
    this.callApi()
      .then(res => this.setState({ response: res.express }))
      .catch(err => console.log(err));
  }
  
  callApi = async () => {
    const response = await fetch('/api/hello');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    
    return body;
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
      selectedFile: event.target.files[0],
      loaded: 0,
    })
  }

  onClickHandler = async e => {
    e.preventDefault();
    this.setState({ parsing: true });
    const data = new FormData() 
    console.log(this.state.selectedFile);
    data.append('file', this.state.selectedFile)
    const response = await fetch('/api/world', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ post: this.state.selectedFile }),
    });
    const body = await response.text();
    
    this.setState({ responseToPost: body });
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
      </div>
    );
  }
}

export default App;