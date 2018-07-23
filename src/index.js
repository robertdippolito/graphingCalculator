import React from 'react';
import ReactDOM from 'react-dom';
import emoji from 'emoji-dictionary';
import 'bulma/css/bulma.css';
import InputView from './components/InputView.js';
import GraphView from './components/GraphView.js';
import HistoryList from './components/HistoryList.js';

// The App view is the parent view of the function input view and the graph view
class AppView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //TODO:local storage -> persist information to browser storage
      //stores the previous formula entries
      history: [],
      //stores the formulas entered
      formula: '',
      //upper and lower bounds of the function
      upperBound: 0,
      lowerBound: 0,
      //the computed output of the function submitted across all values of the bounds
      valueRange: []
    };
    //bind the compute function to the component
    this.computeFormula = this.computeFormula.bind(this);
  }

  computeFormula(formula, upperBound, lowerBound) {

    //mathjs library is used to parse the string inputs into formulas
    const math = require('mathjs');
    const parseFormula = math.parse(formula);
    //copying a version of new value range to avoid directly mutating the state array
    let newValueRange = this.state.valueRange;
    //upperLowerRange determines the range of the chart

    //if no bounds are set use a default of -100 to 100
    if(lowerBound === undefined || upperBound === undefined) {
      const upperLowerRange = Math.abs(-100) + Math.abs(100);
      for(let i = 0; i<=(upperLowerRange); i++) {
        let inputValue = parseFloat(-100) + parseFloat(i);
        let graphPoint = parseFormula.eval({x: inputValue});
        newValueRange[i] = graphPoint;
      }
    } else {
      const upperLowerRange = Math.abs(lowerBound) + Math.abs(upperBound);
      for(let i = 0; i<=(upperLowerRange); i++) {
        let inputValue = parseFloat(lowerBound) + parseFloat(i);
        let graphPoint = parseFormula.eval({x: inputValue});
        newValueRange[i] = graphPoint;
      }
    }

    //set state with all of the values from the child component.
    this.setState({
      valueRange: newValueRange,
      formula: formula,
      upperBound: upperBound,
      lowerBound: lowerBound
    });

    //update the history with the latest formula.
    this.updateHistory(formula);
  }

  //take the previous state's formula and add the next formula to the series.
  updateHistory(formula) {
    this.setState(prevState => ({
      history: [...prevState.history, formula]
    }))
  }

  render() {
    //pass the compute method to the input view to communicate with the parent component.
    //graph view displays the output of the formula.
    // history list displays the previous formulas for the user.
    return (
      <section className="hero">
        <div className="hero-body">
          <div className="container">
            <h1 className="title">
              Welcome to my React Graphing Calculator
              <span role='img' aria-label='hand'>     👋 </span>
            </h1>
            <h2 className="subtitle">
              Please enter a one-variable formula to be drawn on the canvas.
            </h2>
            <div className='columns'>
              <div className='column'>
                <InputView computeFormula={this.computeFormula}
                            formula={this.state.formula}
                            upper={this.state.upperBound}
                            lower={this.state.lowerBound}/>
              </div>
              <div className='column'>
                <GraphView yAxis= { this.state.valueRange }
                            formula= {this.state.formula }
                            lowerBound= { this.state.lowerBound }/>
                  <HistoryList history= {this.state.history} />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

ReactDOM.render(
  <AppView />,
  document.getElementById('root')
)
