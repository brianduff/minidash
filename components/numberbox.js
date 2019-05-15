import Moment from 'react-moment';
var moment = require('moment');

class NumberBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      number: props.number
    }
  }

  setNumber(aNumber) {
    this.setState({
      number: aNumber
    });
  }

  render() {
    return (
      <div className="numberBox">
        <div className="number">{this.state.number}</div>
        <div className="description">{this.props.description}</div>
      </div>
    );
  }
}

class DayCountNumberBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numDays: this.calculateNumDays()
    }
  }

  calculateNumDays() {
    return moment().diff(this.props.since, "days");
  }
  
  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      43200000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);    
  }

  tick() {
    updateNumDays();
  }

  updateNumDays() {
    this.setNumber(this.getNumDays());
  }

  render() {
    return (
      <NumberBox number={this.state.numDays} description={this.props.description} />
    );
  }
}

export { DayCountNumberBox, NumberBox };
