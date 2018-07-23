import React from 'react';
import ReactDOM from 'react-dom';
import 'bulma/css/bulma.css';
import 'chart.js/dist/Chart.js';
import {Line} from 'react-chartjs-2';
import MathJax from 'react-mathjax2';
import * as math from 'mathjs';

// The App view is the parent view of the function input view and the graph view
class AppView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [],
      formula: '',
      upperBound: 0,
      lowerBound: 0,
      valueRange: []
    };
    this.updateGraphView = this.updateGraphView.bind(this);
    this.computeFormula = this.computeFormula.bind(this);
  }

  computeFormula(formula, upperBound, lowerBound) {

    const math = require('mathjs');
    const parseFormula = math.parse(formula);
    var newValueRange = this.state.valueRange;
    const upperLowerRange = Math.abs(lowerBound) + Math.abs(upperBound);
    for(var i = 0; i<=(upperLowerRange); i++) {
      var inputValue = parseFloat(lowerBound) + parseFloat(i);
      console.log('lowerbound value is: ' + lowerBound);
      console.log('the i value is: + ' + i);
      console.log('the input value is: ' + inputValue)
      // console.log('value going into equation is: ' + inputValue);
      var graphPoint = parseFormula.eval({x: inputValue});
      // console.log('value coming out of equation is: ' + graphPoint);
      newValueRange[i] = graphPoint;
    }

    console.log('the new value range is: ' + newValueRange);
    newValueRange = this.state.valueRange;
    this.setState({
      valueRange: newValueRange,
    });

  }

  updateGraphView(formula, upper, lower) {

    this.computeFormula(formula, upper, lower)
    this.setState({
      formula: formula,
      upperBound: upper,
      lowerBound: lower
    });

  }

  render() {
    const history = this.state.history;
    const current = history[history.length - 1];
    return (
      <section className="hero">
        <div className="hero-body">
          <div className="container">
            <h1 className="title">
              Welcome to my React Graphing Calculator
            </h1>
            <h2 className="subtitle">
              Please enter a one-variable formula to be drawn on the canvas.
            </h2>
            <div className='columns'>
              <div className='column'>
                <InputView updateGraphView={this.updateGraphView}
                            formula={this.state.formula}
                            upper={this.state.upperBound}
                            lower={this.state.lowerBound}/>
              </div>
              <div className='column'>
                <GraphView yAxis= { this.state.valueRange }
                            formula= {this.state.formula }
                            lowerBound= { this.state.lowerBound }/>
                <div>Formula History</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

class InputView extends React.Component {
  constructor(props) {
    super(props);
    this.formula = React.createRef();
    this.lowerBound = React.createRef();
    this.upperBound = React.createRef();

    // this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // handleChange(event) {
  //   this.setState({ formula: event.target.value });
  // }

  handleSubmit(event) {
    // console.log('values are:' + this.props.upperBound + ' and ' + this.props.lowerBound);
    // if(this.props.upperBound === 'undefined' || this.props.lowerBound === 'undefined'){
    //   console.log('do not submit form');
    // } else {
    //   console.log('getting this?');
    // }

    //TRUE when no bounds are set
    var isEnabled = !this.lowerBound.current.value;
    if(isNaN(this.lowerBound.current.value) || this.lowerBound.current.value === '') {
      console.log('not a number');
      console.log('the value is: ' + isEnabled);
      return 0;
    }

    if(this.formula.current.value !== '') {
      // this.props.updateGraphView(this.state.formula, this.state.upperBound, this.state.lowerBound);
      const newFormula = this.formula.current.value;
      const newUpper = this.upperBound.current.value;
      const newLower = this.lowerBound.current.value;

      console.log('this is the new value: ' + newFormula);
      console.log('this is the upper and lower bounds: ' + newUpper + ' and ' + newLower);
      this.props.updateGraphView(newFormula, newUpper, newLower);
    } else {
      console.log('no input');
    }
    event.preventDefault();
    this.formula.current.value = '';
    this.upperBound.current.value = '';
    this.lowerBound.current.value = '';
  }

  render() {
    console.log('the value coming from the prop is: ' + this.props.formula);
    const ascii = this.props.formula;

    return (
        <div className='box'>
          <h1 className='title'>Input View</h1>
          <div className='field'>
            <label className='label'>Formula</label>
            <div className='control'>
              <input className='input'
                      type='text'
                      defaultValue=''
                      ref={this.formula}
                      placeholder='Enter a one variable formula e.g. sin(x)'
                    />
                  <p className="help">You must enter a formula to continue.</p>
            </div>
            <hr />
            <div className = 'box'>
              <h1>Previous Formula</h1>
              <MathJax.Context input='ascii'>
                <MathJax.Node inline>{ ascii }</MathJax.Node>
              </MathJax.Context>
            </div>
          </div>
          <div className='field'>
            <label className='label'>Lower Bounds</label>
            <div className='control'>
              <input className='input'
                      type='number'
                      ref={ this.lowerBound }
                      placeholder='Enter the lowerbound range e.g. -10' />
            </div>
          </div>
            <div className='field'>
              <label className='label'>Upper Bounds</label>
                <div className='control'>
                  <input className='input'
                          type='number'
                          ref={ this.upperBound }
                          placeholder='Enter the upperbound range e.g. 10' />
                </div>
            </div>
          <a className='button is-medium is-fullwidth'
              type="submit"
              value="Submit"
              disabled={ this.isEnabled }
              onClick={this.handleSubmit}>
            Submit
          </a>
        </div>
    );
  }
}

//calculation from parent component sent to GraphView
class GraphView extends React.Component {

// The graph view uses the Chart.js & react-chartsjs-2 are libraries to visualize the inputs from Input view
  render() {

    var myData = this.props.yAxis;
    console.log('What am i getting from this? ' + myData);

    var formula = this.props.formula;
    console.log('What is the formula: ' + formula);

    var xAxis = [];
    console.log('my data length is: ' + myData.length);
    for(var i=0; i<myData.length; i++) {
      xAxis[i] = parseFloat(this.props.lowerBound) + parseFloat(i);
    }
    console.log('the x axis is: ' + xAxis);

    const data = {
      labels: xAxis,
      datasets: [
        {
          label: formula,
          data: myData
        }
      ]
    }
    return (
      <div className='box'>
        <h1 className='title'>Graph View</h1>
        <div className="chart">
          <Line
            data = { data }
            options= {{}}
          />
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <AppView />,
  document.getElementById('root')
)
