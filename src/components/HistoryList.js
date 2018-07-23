import React from 'react';

//The history list component displays the previous formulas submitted by the user.
//TODO: -> add unique key to state to address React key requirement.

class HistoryList extends React.Component {
  render() {
    let history = this.props.history;
    let historyList = history.map(function(historyEntry){
      return <li key={ history.uniqueId }>{ historyEntry }</li>;
    })
    return (
      <div className='box'>
        <h1 className='label'>Formula History</h1>
        <ul>{ historyList }</ul>
      </div>
    );
  }
}

export default HistoryList;
