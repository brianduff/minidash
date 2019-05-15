class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      30000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);    
  }

  tick() {
    this.setState({
      date: new Date()
    });
  }

  render() {
    let timeOptions = {
      hour: 'numeric', 
      minute: 'numeric', 
      hour12: false
    }
    let time = new Intl.DateTimeFormat("en-US", timeOptions).format(this.state.date);

    let dateOptions = {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }
    let date = new Intl.DateTimeFormat("en-US", dateOptions).format(this.state.date);
    return (
      <div className="datetime">
        <div className="time">{time}</div>
        <div className="date">{date}</div>
      </div>
    );
  }
}



export default Clock;