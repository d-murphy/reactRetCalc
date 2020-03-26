import React from 'react';
import './App.css';
import '../node_modules/react-vis/dist/style.css';
import {FlexibleWidthXYPlot , XAxis, YAxis, LineSeries} from 'react-vis';
import {Container, Paper, Grid, Slider, Tooltip, IconButton, Switch, Button} from '@material-ui/core';
import {TableContainer, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core'
import InfoTwoToneIcon from '@material-ui/icons/InfoTwoTone';

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
        startingInv: 5000,
        annualInv: 0, 
        oneTimeInv: 0,
        invGrowth: 7, 
        withRate: 4,  
        invTotals: invTotals,
        value: {min: 2, max: 10},
        showGraphs: 1,
        fixYAxis: true,
        scenarios: []
    };
    this.setStateHandler = this.setStateHandler.bind(this);
    this.saveState = this.saveState.bind(this);
    this.doCalc = this.doCalc.bind(this);
  }

  componentDidMount() {
    this.doCalc();
  }
  
  setStateHandler(e, newValue) {
    if (e.target.offsetParent.id === "invRange"){
      this.setState({["invStartAge"]: newValue[0]})
      this.setState({["invEndAge"]: newValue[1]})
    } else if(e.target.offsetParent.id === "startEndAge"){
      this.setState({["startingAge"]: newValue[0]})
      this.setState({["withdrawAge"]: newValue[1]})
    } else if(e.target.name==="fixYAxis") {
      this.setState({[e.target.name]: e.target.checked})
    } else {
      this.setState({[e.target.offsetParent.id]: newValue})
    }
    this.doCalc()
    console.log(this.state.scenarios);
  }

  saveState() {
    this.setState((state) => {
      const scens = [...state.scenarios, state]
      return {scenarios: scens}
    })
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
  

   render() { 
    
    return (
    <Container className="addTopSpace" maxWidth="lg">
      <Grid container spacing={1} direction="row" alignItems="flex-start" >
        <Grid className="Banner" item xs={12}>
          <Paper className="GridPad">
            <Grid container justify="space-between" alignItems="center">
              <Grid item>
                <h3>Retirement Calculator</h3>
                <p>Use the sliders to reflect the details of your retirement plan.  Estimated investment balances and withdrawals are shown.</p>
                <p>Save scenarios to compare alternate plans.</p>
              </Grid>
              <Grid item>
                Fix Y Axis: <Switch  checked={this.state.fixYAxis} onChange={this.setStateHandler} name="fixYAxis" color="primary" />
                <br /><br />
                <Button variant="outlined" color="primary" onClick={this.saveState}>
                Save Scenario
               </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={5}>
          <Inputs startingAge={this.state.startingAge}
                invStartAge={this.state.invStartAge}
                invEndAge={this.state.invEndAge}
                oneTimeInvAge={this.state.oneTimeInvAge}
                withdrawAge={this.state.withdrawAge}
                startingInv={this.state.startingInv}
                annualInv={this.state.annualInv}
                oneTimeInv={this.state.oneTimeInv}
                invGrowth={this.state.invGrowth}
                withRate={this.state.withRate}
                setStateHandler={this.setStateHandler} />
        </Grid>
        <Grid item xs={7}>
          <Paper className="removePaperMargin">
            <center><h4>Investment Balance</h4></center>
            <Plots fixYAxis={this.state.fixYAxis} lineToPlot={this.state.invTotals} yMax={5000000} />
          </Paper>
          <Paper className="removePaperMargin2">
            <center><h4>Annual Withdrawals</h4></center>
            <Plots fixYAxis={this.state.fixYAxis} lineToPlot={this.state.withdrawTotals} yMax={200000} 
                   scenarios={this.state.scenarios} />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <ScenTabel scenarios={this.state.scenarios} />
        </Grid>
      </Grid>
    </Container>

    );
  }
}



class ScenTabel extends React.Component {
  render() {
    if(this.props.scenarios.length>0){
     return (
         <Paper>
          <TableContainer>
            <Table >
              <TableHead>
                <TableRow>
                  <TableCell align="center">Line Color</TableCell>
                  <TableCell align="center">Starting Age</TableCell>
                  <TableCell align="center">Inv Start Age</TableCell>
                  <TableCell align="center">Inv End Age</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.props.scenarios.map((scen, i) => <TRow key = {i} 
                        data = {scen} />)}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
     )
    } else {
      return (<TableContainer />);
    }
  }
}

class TRow extends React.Component {
  render() {
     return (
          <TableRow >
            <TableCell align="center"></TableCell>
            <TableCell align="center">{this.props.data.startingAge}</TableCell>
            <TableCell align="center">{this.props.data.invStartAge}</TableCell>
            <TableCell align="center">{this.props.data.invEndAge}</TableCell>
          </TableRow>
     );
  }
}

class Plots extends React.Component {
  render() {

    

    if(!this.props.fixYAxis){
      return(
       <FlexibleWidthXYPlot  margin={{left: 80}} height={300} > 
        <XAxis />
        <YAxis />        
        <LineSeries data={this.props.lineToPlot} />
       </FlexibleWidthXYPlot >
      )
    } else {
       return(
       <FlexibleWidthXYPlot  margin={{left: 80}} height={300} yDomain ={[0,this.props.yMax]} > 
        <XAxis />
        <YAxis />
        <LineSeries data={this.props.lineToPlot} />
       </FlexibleWidthXYPlot >
     )}
  }
}




class Inputs extends React.Component {
  render() {
    return( 
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Paper>
            <Grid container alignItems="center">
              <Grid className="GridPad" item xs={12}>
                  I am&nbsp;<span className="intextVar">{this.props.startingAge}</span>
                  &nbsp;years old and plan to retire at&nbsp;<span className="intextVar">{this.props.withdrawAge}</span>. 
                <Grid className="GridPad" item xs={10}>
                  <Slider id="startEndAge" defaultValue = {[18,55]}  min={18} max={80} valueLabelDisplay="auto" onChangeCommitted={this.props.setStateHandler} />
                </Grid>
              </Grid>
            </Grid>

            <Grid container alignItems="center">
              <Grid className="GridPad" item xs={12}>
                  I have&nbsp;<span className="intextVar">${this.props.startingInv}</span>
                  &nbsp;saved for retirement. 
                <Grid className="GridPad" item xs={10} >
                  <Slider id="startingInv" min={0} max={500000} step={1000} defaultValue={5} valueLabelDisplay="auto" onChangeCommitted={this.props.setStateHandler} />
                </Grid>
              </Grid>
            </Grid>
            <Grid container alignItems="center">
              <Grid className="GridPad" item xs={12}>
                  I plan to invest starting at age&nbsp;<span className="intextVar">{this.props.invStartAge}</span>
                  &nbsp; and ending at age&nbsp;<span className="intextVar">{this.props.invEndAge}</span>.
                <Grid className="GridPad" item xs={10} >
                  <Slider id="invRange" defaultValue = {[25, 55]} min={18} max={80} valueLabelDisplay="auto" onChangeCommitted={this.props.setStateHandler} />
                </Grid>
              </Grid>
            </Grid>

            <Grid container alignItems="center">
              <Grid className="GridPad" item xs={12}>
                  I plan to invest &nbsp;<span className="intextVar">${this.props.annualInv}</span>
                  &nbsp; annually.
                <Grid className="GridPad" item xs={10} >
                  <Slider id="annualInv" min={0} max={100000} step={1000} defaultValue={0}  valueLabelDisplay="auto" onChangeCommitted={this.props.setStateHandler} />
                </Grid>
              </Grid>
            </Grid>

          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper>
            <Grid container>
              <Grid className="GridPad" item xs={6}>
                Age of One Time Investment or Expenditure:&nbsp;<span className="intextVar">{this.props.oneTimeInvAge}</span>
               <Tooltip placement="right" title="In this section, use a positive value to see the impact of a one-time investment such as an employment bonus.  Use a negative value to see how retirement considerations are affected by an expenditure such as using retirement funds for a down payment.">
                 <IconButton aria-label="text2">
                   <InfoTwoToneIcon />
                 </IconButton>
               </Tooltip>

              </Grid>
              <Grid className="GridPad" item xs={6}>
                <Slider id="oneTimeInvAge"  min={18} max={80} defaultValue={30} valueLabelDisplay="auto" onChangeCommitted={this.props.setStateHandler} />
              </Grid>
            </Grid>
            <Grid container>
              <Grid className="GridPad" item xs={6}>
                Value:&nbsp;<span className="intextVar">${this.props.oneTimeInv}</span>
              </Grid>
              <Grid className="GridPad" item xs={6}>
                <Slider id="oneTimeInv" min={-100000} max={100000} step={5000} defaultValue={0}  valueLabelDisplay="auto" onChangeCommitted={this.props.setStateHandler} />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper>
            <Grid container>
              <Grid className="GridPad" item xs={6}>
                Annual Return:&nbsp;<span className="intextVar">{this.props.invGrowth}%</span>
              </Grid>
              <Grid className="GridPad" item xs={6}>
                <Slider id="invGrowth"  min={0} max={10} defaultValue={7} valueLabelDisplay="auto" onChangeCommitted={this.props.setStateHandler} />
              </Grid>
            </Grid>
            <Grid container>
              <Grid className="GridPad" item xs={6}>
                Withdrawal Rate:&nbsp;<span className="intextVar">{this.props.withRate}%</span>
              </Grid>
              <Grid className="GridPad" item xs={6}>
                <Slider id="withRate"  min={0} max={10} defaultValue={4} valueLabelDisplay="auto" onChangeCommitted={this.props.setStateHandler} />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    )
  }
}

export default App;
