import React from 'react';
import './App.css';
import '../node_modules/react-vis/dist/style.css';
import {XYPlot, VerticalGridLines, HorizontalGridLines, XAxis, YAxis, Crosshair, LineSeries} from 'react-vis';

class App extends React.Component {
  constructor() {
    super();
    let invTotals = [];
    for(let i=18; i<81; i++){
      invTotals[i-18] = {age: i, inv: 0}
    }
    this.state = {
        startingAge: 18, 
        invStartAge: 18, 
        invEndAge: 18,
        oneTimeInvAge: 30, 
        withdrawAge: 55,
        startingInv: 10000,
        annualInv: 0, 
        oneTimeInv: 0,
        invGrowth: 7, 
        withRate: 4,
        invTotals: invTotals
    };
    this.setStateHandler = this.setStateHandler.bind(this);
  }

  setStateHandler(e) {
    this.setState({[e.target.name]: e.target.value})

    let newInvTots = [];
    for(let i=18; i<81; i++){
      let yearTot = 0;
      if(i===this.state.startingAge){yearTot =+ this.state.startingInv}
      newInvTots[i-18] = {age: i, inv: yearTot}
    }
    this.setState({invTotals: newInvTots})
    console.log(this.state);
  }

  render() { 
    const data = [
      {x: 0, y: 8},
      {x: 1, y: 4},
      {x: 2, y: 2},
      {x: 3, y: 6},
      {x: 4, y: 1},
      {x: 5, y: 2},
      {x: 6, y: 3},
      {x: 7, y: 1}
    ];

    const data2 = [
      {x: 0, y: 4},
      {x: 1, y: 2},
      {x: 2, y: 6},
      {x: 3, y: 8},
      {x: 4, y: 10},
      {x: 5, y: 12},
      {x: 6, y: 13},
      {x: 7, y: 11}
    ];

    const myValues = [
      {x:5},
      {x:5}
    ]

    return (
    <div className="App2">
      <label for="startingAge">Starting Age: </label>
      <input type="number" value={this.state.startingAge} onChange = {this.setStateHandler} name = "startingAge" />
      <label for="invStartAge">Investing Start Age: </label>
      <input type="number" value={this.state.invStartAge} onChange = {this.setStateHandler} name = "invStartAge" />
      <label for="invEndAge">Investing End Age: </label>
      <input type="number" value={this.state.invEndAge} onChange = {this.setStateHandler} name = "invEndAge" />
      <label for="oneTimeInvAge">One Time Investment Age: </label>
      <input type="number" value={this.state.oneTimeInvAge} onChange = {this.setStateHandler} name = "oneTimeInvAge" />
      <h1>Calc</h1>
      <p>Starting Age: {this.state.startingAge}</p>
      <p>Inv Start Age: {this.state.invStartAge}</p>
      <p>Inv End Age: {this.state.invEndAge}</p>
      <p>One Time Inv Age: {this.state.oneTimeInvAge}</p>
      <div className="App">
        <XYPlot height={600} width={600}>
          <XAxis />
          <YAxis />
          <VerticalGridLines />
          <HorizontalGridLines />
          <LineSeries data={data}  />
          <LineSeries data={data2}  />
          <Crosshair values={myValues}>
            <div style={{background: 'green'}}>
              <h3>Values of crosshair:</h3>
              <p>Series 1: {myValues[0].x}</p>
              <p>Series 2: {myValues[1].x}</p>
            </div>
          </Crosshair>
        </XYPlot>
      </div>
    </div>
    );
  }
}

export default App;
