import React from 'react';
import './App.css';
import '../node_modules/react-vis/dist/style.css';
import {XYPlot, XAxis, YAxis, LineSeries} from 'react-vis';
import InputRange from 'react-input-range'
import "react-input-range/lib/css/index.css";

class App extends React.Component {
  constructor() {
    super();
    let invTotals = [];
    let withdrawTotals = [];
    for(let i=18; i<81; i++){
      invTotals[i-18] = {x: i, y: 0}
      withdrawTotals[i-18] = {x: i, y: 0}
    }
    this.state = {
        startingAge: 18, 
        invStartAge: 25, 
        invEndAge: 55,
        oneTimeInvAge: 30, 
        withdrawAge: 55,
        startingInv: 10000,
        annualInv: 0, 
        oneTimeInv: 0,
        invGrowth: 7, 
        withRate: 4,
        invTotals: invTotals,
        value: {min: 2, max: 10}
    };
    this.setStateHandler = this.setStateHandler.bind(this);
    this.doCalc = this.doCalc.bind(this);
    this.printTots = this.printTots.bind(this);
  }
  
  setStateHandler(e) {
    this.setState({[e.target.name]: e.target.value})
    this.doCalc()
  }
  
  doCalc() {
    let newInvTots = [];
    let newWithdrawTots = [];
    for(let i=18; i<81; i++){
      let yearTot = 0;
      let yearWith = 0;
      // Add interest to last years total.  Starts after year 18.
      if(i>18){
        yearTot += newInvTots[i-19].y * (1 + (parseFloat(this.state.invGrowth)/100))
      }
      // withdraw funds if appropriate
      if(i>=parseInt(this.state.withdrawAge)){
        yearWith = newInvTots[i-19].y * (parseFloat(this.state.withRate)/100)
        yearTot -= yearWith
      }
      // find the starting age and include that total
      if(i===parseInt(this.state.startingAge)){
        yearTot += parseFloat(this.state.startingInv)
      }
      // add in one time investment at appropripate year
      if(i===parseInt(this.state.oneTimeInvAge)){
        yearTot += parseFloat(this.state.oneTimeInv)
      }
      // add in annual investment for appropriate years
      if(i>=this.state.invStartAge & i<=this.state.invEndAge){
        yearTot += parseFloat(this.state.annualInv)
      }

      newInvTots[i-18] = {x: i, y: yearTot}
      newWithdrawTots[i-18] = {x: i, y: yearWith}
      
    }
    this.setState({invTotals: newInvTots})
    this.setState({withdrawTotals: newWithdrawTots})
  }
  
  printTots() {
    console.log( this.state.invTotals );
    }

   render() { 
    
    return (
    <div className="App">
      <div className="Inputs">
        <h3>Enter your retirement plan:</h3>
        <p>Starting Age:</p> 
        <InputRange maxValue={80} minValue={18} value={this.state.startingAge}  onChange= {startingAge => this.setState({ startingAge })} />
        <label>Starting Investment Value:
          <input type="number" value={this.state.startingInv} onChange = {this.setStateHandler} name = "startingInv" />        
        </label>
        <hr />
        <label>Annual Investment Start Age:
          <input type="number" min={18} max={80} value={this.state.invStartAge} onChange = {this.setStateHandler} name = "invStartAge" />
        </label>
        <label>Annual Investment End Age:
          <input type="number" min={18} max={80} value={this.state.invEndAge} onChange = {this.setStateHandler} name = "invEndAge" />
        </label>
        <label>Annual Investment Value:
          <input type="number" value={this.state.annualInv} onChange = {this.setStateHandler} name = "annualInv" />
        </label>
        <hr />
        <label>One Time Investment Age:
          <input type="number" min={18} max={80} value={this.state.oneTimeInvAge} onChange = {this.setStateHandler} name = "oneTimeInvAge" />
        </label>
        <label>One Time Investment Value: 
          <input type="number" value={this.state.oneTimeInv} onChange = {this.setStateHandler } name = "oneTimeInv" />
        </label>
        <hr />
        <label>Annual Return:
          <input type="number" value={this.state.invGrowth} onChange = {this.setStateHandler} name = "invGrowth" />
        </label>
        <label>Withdrawal Age:
          <input type="number" min={18} max={80} value={this.state.withdrawAge} onChange = {this.setStateHandler } name = "withdrawAge" />
        </label>
        <label>Withdrawal Percentage:
          <input type="number" value={this.state.withRate} onChange = {this.setStateHandler } name = "withRate" />
        </label> 
        <hr />
        <button onClick={this.doCalc}>Do the thing</button>
        <button onClick={this.printTots}>Print the Tots!</button>
      </div>

      <div className="Charts">
        <XYPlot margin={{left: 100}} height={300} width={600}>
          <XAxis />
          <YAxis />
          <LineSeries data={this.state.invTotals} />
        </XYPlot>
        <XYPlot margin={{left: 100}} height={300} width={600}>
          <XAxis />
          <YAxis />
          <LineSeries data={this.state.withdrawTotals} />
        </XYPlot>

      </div>
    </div>
    );
  }
}

export default App;
