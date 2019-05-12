import Head from 'next/head';
import Moment from 'react-moment';

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

function Preamble() {
  return (
    <Head>
      <link rel="manifest" href="/static/manifest.json" />
      <link rel="stylesheet" href="/static/style.css" type="text/css" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <link href="https://fonts.googleapis.com/css?family=Roboto:100,200,300,400" rel="stylesheet" />
      <title>I am a page</title>
    </Head>
  );
}

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

function Hello(props) {
  return <div>Hello {props.name}!</div>
}

function Home() {
  return (
    <div>
      <Preamble />
      <Clock />
  
      <div className="gridContainer">
        <DayCountNumberBox since="2019-05-10" description="Daddy days without chips" />
        <NumberBox number="25" description="Michael's gold coins" />
        <NumberBox number="25" description="Caitlin's gold coins" />
      </div>
    </div>
  );  
}

export default Home;