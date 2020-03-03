import React from 'react';
import './App.css';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      input: [2,3,4]
    }
  }
  render() { 
    return (
    <div className="App">
      <h1>Hello World!</h1>
      <p>{this.state.input[0]}</p>
    </div>
    );
  }
}

export default App;
