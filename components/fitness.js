import { NumberBox } from "./numberbox";

class BMI extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bmi: 0,
      category: ""
    };
  }

  async fetchData() {
    let response = await fetch("/fitbit/bmi");
    return await response.json();
  }

  componentDidMount() {
    this.fetchData().then(bmiInfo => {
      let bmi = bmiInfo[bmiInfo.length - 1].data;
      // Figure out the bmi category.
      let category = "Underweight";
      let criticality = "medium";
      if (bmi >= 18.5 && bmi < 25) {
        category = "Normal";
        criticality = "normal";
      } else if (bmi >= 25 && bmi < 30) {
        category = "Overweight";
        criticality = "medium";
      } else if (bmi > 30) {
        category = "Obese";
        criticality = "high";
      }

      this.setState({
        bmi: bmiInfo[bmiInfo.length - 1].data,
        category: category,
        criticality: criticality
      });
    });
  }

  render() {
    return (
      <NumberBox
        number={this.state.bmi}
        description={"BMI (" + this.state.category + ")"}
        criticality={this.state.criticality}
      />
    );
  }
}

export default BMI;
