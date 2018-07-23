import React from 'react';
import MathJax from 'react-mathjax2';

//The input view serves as the main interaction point with the user the user must enter a formula and has the option of submitting a lower and upper bounds.
//The mathJax library displays the formula output to help the user visualize the formula.
//This component sends data back to the parent component through compute formula.

class InputView extends React.Component {
  constructor(props) {
    super(props);

    //form input handlers.
    this.handleFormulaInput = this.handleFormulaInput.bind(this);
    this.handleLowerBoundInput = this.handleLowerBoundInput.bind(this);
    this.handleUpperBoundInput = this.handleUpperBoundInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleFormulaInput(event) {
    this.setState({ formula: event.target.value });
  }

  handleLowerBoundInput(event) {
    this.setState({ lowerBound: event.target.value });
  }

  handleUpperBoundInput(event) {
    this.setState({ upperBound: event.target.value })
  }

  //this sends the updated states of formula and upper/lowerbound to the comute formula in the parent component.
  //a check is performed to determine if the user specified a formula.
  //form validation needs some work -> still several scenarios that will break the app i.e. input more then one variable or when you submit without interacting with the form.
  //looking back I would have avoided allowing the user this much freedom with form inputs.

  handleSubmit(event) {

    console.log('the input is :' + this.state.formula);
    if(this.state.formula === undefined || this.state.formula === '') {
      alert('not formula entered!');
      return false;
    } else {
      let formula = this.state.formula;
      let variableSearch = formula.search('x');
      if(variableSearch < 0) {
        alert('Please use x as your variable.')
        } else {
          this.props.computeFormula(this.state.formula, this.state.upperBound, this.state.lowerBound);
        }
      }
    //prevents page from reloading.
    event.preventDefault();
  }
  render() {
    //form used to capture user data.
    const ascii = this.props.formula;
    return (
      <div className='box'>
          <h1 className='title'>Input View</h1>
          <div className='field'>
            <label className='label'>Formula</label>
            <div className='control'>
              <input className='input'
                        type='text'
                        id='formula-id'
                        defaultValue= { this.props.formula }
                        onChange= { this.handleFormulaInput }
                        placeholder='Enter a one variable formula e.g. sin(x)'
                      />
              <p className="help"></p>
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
                  <input  className='input'
                          type='number'
                          value= { this.props.lowerBound }
                          onChange= { this.handleLowerBoundInput }
                          placeholder='Enter the lowerbound range e.g. -10' />
                    </div>
              </div>
                <div className='field'>
                  <label className='label'>Upper Bounds</label>
                    <div className='control'>
                      <input className='input'
                              type='number'
                              value={ this.props.upperBound }
                              onChange= { this.handleUpperBoundInput }
                              placeholder='Enter the upperbound range e.g. 10' />
                    </div>
                </div>
              <a className='button is-medium is-fullwidth'
                  type="submit"
                  onClick={this.handleSubmit}>
                Submit
              </a>
          </div>
    );
  }
}

export default InputView;
