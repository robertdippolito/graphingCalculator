import React from 'react';
import 'chart.js/dist/Chart.js';
import {Line} from 'react-chartjs-2';

//The Graph View class displays the visual output of the formula submitted by the user.
//

class GraphView extends React.Component {

// The graph view uses the Chart.js & react-chartsjs-2 are libraries to visualize the inputs from Input view
  render() {

    var myData = this.props.yAxis;

    var formula = 'The Formula is: ' + this.props.formula;

    var xAxis = [];

    console.log('my data length is: ' + myData.length);
    for(var i=0; i<myData.length; i++) {
      if(this.props.lowerBound === undefined) {
        console.log('myData.length is ' + myData);
        xAxis[i] = parseFloat(-100) + parseFloat(i);
      } else {
        xAxis[i] = parseFloat(this.props.lowerBound) + parseFloat(i);
      }
    }
    console.log('the x axis is: ' + xAxis);

    const data = {
      labels: xAxis,
      datasets: [
        {
          label: formula,
          data: myData,
          pointBackgroundColor: '#3FBFBF',
          backgroundColor: 'rgba(75,192,192,0.4)',
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

export default GraphView;
