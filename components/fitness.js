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

class Weight extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      weight: 0,
      category: "",
      weightGoal: props.weightGoal,
      weightGoalDiff: 0
    };
  }

  async fetchData() {
    let response = await fetch("/fitbit/weight");
    return await response.json();
  }

  componentDidMount() {
    this.fetchData().then(info => {
      let weight = info[info.length - 1].data;

      let weightGoalDiff = weight - this.props.weightGoal;

      // Figure out the bmi category.
      let criticality = "medium";
      if (weightGoalDiff <= 0) {
        criticality = "good";
      } else if (weightGoalDiff > 0 && weightGoalDiff < 20) {
        criticality = "medium";
      } else {
        criticality = "high";
      }

      this.setState({
        weight: weight,
        weightGoalDiff: weightGoalDiff,
        criticality: criticality
      });
    });
  }

  renderWeightGoalDiff() {
    if (this.state.weightGoalDiff == 0) {
      return "at target";
    } else if (this.state.weightGoalDiff > 0) {
      return this.state.weightGoalDiff.toFixed(1) + " above target";
    } else {
      return this.state.weightGoalDiff.toFixed(1) + " below target";
    }
  }

  render() {
    return (
      <NumberBox
        number={this.state.weight + " lb"}
        description={"Weight (" + this.renderWeightGoalDiff() + ")"}
        criticality={this.state.criticality}
      />
    );
  }
}

export { BMI, Weight };
