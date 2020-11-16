import React, { Component } from "react";
import { Tabs, Tab, Button } from "react-bootstrap";
import { Container, Row, Col } from "react-bootstrap";
import { PathLine } from "react-svg-pathline";
import SvgLines from "react-mt-svg-lines"; // ES6+

class Cue extends Component {
  // Initialize the state
  constructor(props) {
    super(props);

    this.handleNextCue = this.handleNextCue.bind(this);
    this.handleLoadCues = this.handleLoadCues.bind(this);
    this.state = {
      cuenum: 0,
      cues: "",
      pastpoint: [
        { x: 100, y: 10 },
        { x: 100, y: 100 },
      ],
      activepath: [{ x: 100, y: 10 }],
    };
  }

  handleNextCue(event) {
    //alert(this.state.cue)
    this.state.cuenum += 1;
    this.updateHome();
    this.setState({
      activepath: [
        { x: 100, y: 100 },
        { x: 10, y: 100 },
      ],
      
    });
    this.state.pastpoint.push({ x: 10, y: 100 }) 

  }
  handleLoadCues() {
    var data = require("./cuelisttest.json");
    this.setState({
      cues: data,
    });
    this.sendData();
  }

  // Start timer on page load
  componentDidMount() {
    this.updateHome();
  }
  updateHome = () => {
    var out = 1 + "," + this.state.cuenum + "," + 1;
    fetch("/api/home", {
      //The remaining url of the localhost:5000 server.
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: out,
      }),
    });
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }
  // Send data to the server. We round so that we dont send the 15 trailing decimals.
  sendData = () => {
    var out = this.state.clicky;
    fetch("/api/cue", {
      //The remaining url of the localhost:5000 server.
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: this.state.cues }),
      // body: JSON.stringify({data: "Hello World. \n My name is Jennifer. \n What is your name?"  }),
    });
  };

  //What will render on the client page
  render() {
    return (
      //implement back cue
      <div className="App">
        <Row>
          <Col>
            <svg>
              <PathLine
                points={this.state.pastpoint}
                stroke="red"
                strokeWidth="3"
                fill="none"
                r={10}
              />
            </svg>
            <SvgLines animate={true} duration={5000}>
              <svg>
                <PathLine
                  points={this.state.activepath}
                  stroke="red"
                  strokeWidth="3"
                  fill="none"
                  r={10}
                />
              </svg>
            </SvgLines>
          </Col>
          <Col>
            <Button variant="warning">Back</Button>
            <Button variant="success" onClick={this.handleNextCue}>
              Next
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
  /*<button onClick={this.handleNextCue}>Next</button>
    <button onClick={this.handleLoadCues}>Load</button>*/
}

export default Cue;
