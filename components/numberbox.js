import Moment from 'react-moment';

class NumberBox extends React.Component {
  constructor(props) {
    super(props);
  }

  getNumber() {
    return this.props.number;
  }

  render() {
    return (
      <div className="numberBox">
        <div className="number">{this.getNumber()}</div>
        <div className="description">{this.props.description}</div>
      </div>
    );
  }
}

class DayCountNumberBox extends NumberBox {
  constructor(props) {
    super(props);
  }

  getNumber() {
    return (
      <div>
        <Moment diff={this.props.since} unit="days">{new Date()}</Moment>
      </div>
    )
  }
}


export { DayCountNumberBox, NumberBox };
