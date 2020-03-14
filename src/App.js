import React from 'react';
import './App.css';
import '../node_modules/react-vis/dist/style.css';
import {XYPlot, VerticalGridLines, HorizontalGridLines, XAxis, YAxis, Crosshair, LineSeries} from 'react-vis';

class App extends React.Component {
  constructor() {
    super();
    let invTotals = [];
    for(let i=18; i<81; i++){
      invTotals[i-18] = {x: i, y: 0}
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
    this.doCalc = this.doCalc.bind(this);
  }
  
  setStateHandler(e) {
    this.setState({[e.target.name]: e.target.value})
  }
  
  doCalc() {
    let newInvTots = [];
    for(let i=18; i<81; i++){
      let yearTot = 0;
      if(i>18){
        yearTot += newInvTots[i-19].inv * (1 + (parseFloat(this.state.invGrowth)/100))
      }
      if(i==this.state.startingAge){
        yearTot += parseFloat(this.state.startingInv)
      }
      if(i>=this.state.invStartAge & i<this.state.invEndAge){
        yearTot += parseFloat(this.state.annualInv)
      }
      newInvTots[i-18] = {age: i, inv: yearTot}
    }
    this.setState({invTotals: newInvTots})
    console.log(this.state.invTotals);

  }
  

  render() { 
    const data = this.state.invTotals;
    
//    const data = [
//      {x: 0, y: 8},
//      {x: 1, y: 4},
//      {x: 2, y: 2},
//      {x: 3, y: 6},
//      {x: 4, y: 1},
//     {x: 5, y: 2},
//      {x: 6, y: 3},
//      {x: 7, y: 1}
//    ];

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
      <div className="Inputs">
        <h3>Enter your retirement plan:</h3>
        <label for="startingAge">Starting Age: </label>
        <input type="number" value={this.state.startingAge} onChange = {this.setStateHandler} name = "startingAge" />        
        <label for="startingInv">Starting Investment Value: </label>
        <input type="number" value={this.state.startingInv} onChange = {this.setStateHandler} name = "startingInv" />        
        <hr />
        <label for="invStartAge">Annual Investment Start Age: </label>
        <input type="number" value={this.state.invStartAge} onChange = {this.setStateHandler} name = "invStartAge" />
        <label for="InvEndAge">Annual Investment End Age: </label>
        <input type="number" value={this.state.invEndAge} onChange = {this.setStateHandler} name = "invEndAge" />
        <label for="annualInv">Annual Investment Value: </label>
        <input type="number" value={this.state.annualInv} onChange = {this.setStateHandler} name = "annualInv" />
        <hr />
        <label for="oneTimeInvAge">One Time Investment Age: </label>
        <input type="number" value={this.state.oneTimeInvAge} onChange = {this.setStateHandler} name = "oneTimeInvAge" />
        <label for="oneTimeInv">One Time Investment Value: </label>
        <input type="number" value={this.state.oneTimeInv} onChange = {this.setStateHandler } name = "oneTimeInv" />

        <hr />
        <label for="withdrawAge">Withdrawal Age: </label>
        <input type="number" value={this.state.withdrawAge} onChange = {this.setStateHandler } name = "withdrawAge" />
        <label for="withRate">Withdrawal Percentage: </label>
        <input type="number" value={this.state.withRate} onChange = {this.setStateHandler } name = "withRate" />
         
        <hr />
        <button onClick={this.doCalc}>Do the thing</button>
      </div>

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
