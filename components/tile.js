class Tile extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={"Tile Tile-" + this.props.color}>
        {this.props.children}
      </div>
    );
  }
}

Tile.defaultProps = {
  color: "black"
};

export default Tile;
