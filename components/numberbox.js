import Moment from "react-moment";
const moment = require("moment");

class NumberBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      number: props.number,
      criticality: props.criticality,
      description: props.description
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      number: props.number,
      criticality: props.criticality,
      description: props.decription
    });
  }

  render() {
    return (
      <div className="numberBox">
        <div className={"number " + this.state.criticality}>
          {this.state.number}
        </div>
        <div className="description">{this.props.description}</div>
      </div>
    );
  }
}

class DayCountNumberBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numDays: this.calculateNumDays(this.props.since)
    };
  }

  calculateNumDays(sinceDate) {
    return moment().diff(sinceDate, "days");
  }

  async fetchDate(dateId) {
    let response = await fetch("/dates/" + this.props.dateId);
    let data = await response.json();
    return data;
  }

  componentDidMount() {
    this.timerID = setInterval(() => this.tick(), 43200000);

    if (this.props.dateId != null) {
      this.fetchDate().then(data => {
        this.setState({
          numDays: this.calculateNumDays(data.value)
        });
      });
    }
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    updateNumDays(this.props.since);
  }

  updateNumDays(sinceDate) {
    this.setState({
      numDays: this.calculateNumDays(sinceDate)
    });
  }

  render() {
    return (
      <NumberBox
        number={this.state.numDays}
        description={this.props.description}
      />
    );
  }
}

export { DayCountNumberBox, NumberBox };
