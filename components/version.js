class Version extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      version: "loading"
    };
  }

  async fetchVersion() {
    let response = await fetch("/versionInfo/");
    return await response.json();
  }

  componentDidMount() {
    this.fetchVersion().then(versionInfo => {
      this.setState({
        version: versionInfo.commit
      });
    });
  }

  render() {
    return (
      <div className="bottomRight">
        <a
          href={
            "https://github.com/brianduff/minidash/commit/" + this.state.version
          }
        >
          Version: {this.state.version.substring(0, 7)}
        </a>
      </div>
    );
  }
}

export default Version;
