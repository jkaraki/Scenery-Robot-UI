import React, { Component, useState } from "react";
import { Link } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";
import style from "bootstrap/dist/css/bootstrap.css";
import { Container, Row, Col } from "react-bootstrap";
import Navbar from "react-bootstrap/Navbar";
import { Tabs, Tab, Modal } from "react-bootstrap";
import SimpleStorage, { resetParentState } from "react-simple-storage";
import "rc-slider/assets/index.css";
import "rc-tooltip/assets/bootstrap.css";
import Tooltip from "rc-tooltip";
import Slider from "rc-slider";
import List from "./List";
import Cues from "./Cue";
import styled from "@emotion/styled";
import StickyFooter from "react-sticky-footer";

const black = "#161617";

const Wrapper = styled("div")`
background: ${black},
body: ${black}
`;

const Handle = Slider.Handle;
const handle = props => {
  const { value, dragging, index, ...restProps } = props;
  return (
    <Tooltip
      prefixCls="rc-slider-tooltip"
      overlay={value}
      visible={dragging}
      placement="top"
      key={index}
    >
      <Handle value={value} {...restProps} />
    </Tooltip>
  );
};
class Home extends Component {
  constructor(props) {
    super(props);
    this.manSelect = this.manSelect.bind(this); //add load cues
    this.cueSelect = this.cueSelect.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleShowModal = this.handleShowModal.bind(this);
    this.handleChangeIP = this.handleChangeIP.bind(this);
    this.handleShowModalRobot = this.handleShowModalRobot.bind(this);
    this.handleCloseModalRobot = this.handleCloseModalRobot.bind(this);
    this.onSpeedChange = this.onSpeedChange.bind(this);
    this.onChangeHandler = this.onChangeHandler.bind(this);

    this.state = {
      modal_ip: false,
      modal_robot: false,
      ip: "192.168.0.000",
      mode: 0,
      speed: 50,
      cues:'',
      cues_load: [2, 85, 5, 43]
    };
    this.initialState = this.state;
  }
  sendData = () => {
    var out = this.state.mode + "," + 0 + "," + 1;
    fetch("/api/home", {
      //The remaining url of the localhost:5000 server.
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: out
      })
    });
  };
  componentDidMount() {
    var data = require("./files/prefs.json");
    console.log(this.state.cues_load[2]);

    this.sendData();
  }
  manSelect() {
    this.setState({
      mode: 2
    });
    this.sendData();
  }
  cueSelect() {
    this.setState({
      mode: 1
    });
    this.sendData();
  }
  handleLoadCues() {
    var data = require("./cuelisttest.json");
    fetch("/api/cue", {
      //The remaining url of the localhost:5000 server.
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: data
      })
    });
    //this.sendData();
  }
  handleShowModal() {
    this.setState({
      modal_ip: true
    });
  }
  handleCloseModal() {
    this.setState({
      modal_ip: false
    });
  }
  handleChangeIP(event) {
    this.setState({
      ip: event.target.value
    });
  }
  handleShowModalRobot() {
    this.setState({
      modal_robot: true
    });
  }
  handleCloseModalRobot() {
    this.setState({
      modal_robot: false
    });
  }
  onChangeHandler=event=>{

    console.log(event.target.files[0])

  }
  handleChangeRobotPref(event) {
    this.setState({
      speed: event.target.value
    });
  }
  onSpeedChange(value) {
    this.setState({ speed: (value * 127) / 100 }); //normalize the speed from a 1-100 percentage to 1-127 speed
  }
  render() {
    const items = this.state.cues_load.map(function(item) {
      return <li> {item} </li>;
    });
    return (
      <Wrapper className="App">
        <SimpleStorage parent={this} />
        <Navbar bg="dark" variant="dark" expand="lg">
          <Navbar.Brand href="#home">Robot UI v2</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="https ://github.com/rybitski/Scenery-Robot-V3/wiki">
                Wiki
              </Nav.Link>
              <NavDropdown title="Connections" id="basic-nav-dropdown">
                <NavDropdown.Item onClick={this.handleShowModal}>
                  Start a New Connection
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">
                  Test Connection
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">Get Info</NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title="Cue List" id="basic-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">
                  Recent Cues
                </NavDropdown.Item>
                <NavDropdown.Item onClick={this.handleLoadCues}>
                  Load New Set
                </NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title="Robot Settings" id="basic-nav-dropdown">
                <NavDropdown.Item onClick={this.handleShowModalRobot}>
                  Start a New Connection
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Form inline>
              <FormControl
                type="text"
                placeholder="Search"
                className="mr-sm-2"
              />
              <Button variant="outline-success">Search</Button>
            </Form>
          </Navbar.Collapse>
        </Navbar>
        <Container fluid style={{height: (window.innerHeight-140)}}> 
          <Modal show={this.state.modal_ip} onHide={this.handleCloseModal}>
            <form onSubmit={this.handleCloseModal}>
              <Modal.Header closeButton>
                <Modal.Title>Modal heading</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="form-group col-md-6">
                  IP:
                  <input
                    type="text"
                    value={this.state.ip}
                    onChange={this.handleChangeIP}
                    className="form-control"
                  />
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={this.handleCloseModal}>
                  Close
                </Button>
                <Button variant="primary" onClick={this.handleCloseModal}>
                  Save Changes
                </Button>
              </Modal.Footer>
            </form>
          </Modal>
          <Modal
            show={this.state.modal_robot}
            onHide={this.handleCloseModalRobot}
          >
            <form onSubmit={this.handleCloseModalRobot}>
              <Modal.Header closeButton>
                <Modal.Title>Robot Preferences</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="form-group col-md-6">
                  Maximum Speed:
                  <Slider
                    min={0}
                    max={100}
                    defaultValue={50}
                    onChange={this.onSpeedChange}
                    handle={handle}
                  />
                  <input
                    type="text"
                    value={this.state.speed}
                    onChange={this.handleChangeRobotPref}
                    className="form-control"
                  />
                </div>
                <div className="form-group col-md-6">
                  Offset Range:
                  <Slider
                    min={0}
                    max={1023}
                    defaultValue={50}
                    onChange={this.onSpeedChange}
                    handle={handle}
                  />
                  <input
                    type="text"
                    value={this.state.speed}
                    onChange={this.handleChangeRobotPref}
                    className="form-control"
                  />
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={this.handleCloseModalRobot}
                >
                  Close
                </Button>
                <Button variant="primary" onClick={this.handleCloseModalRobot}>
                  Save Changes
                </Button>
              </Modal.Footer>
            </form>
          </Modal>
          <Col>
            <Row>
              <Col>
                <Tabs defaultActiveKey="cue" id="uncontrolled-tab-example">
                  <Tab eventKey="man" title="Manual Control">
                    <h2> Manual Control</h2>
                    <p>
                      {" "}
                      Only do this if you are absolutely sure, please consult
                      the wiki for more info{" "}
                    </p>
                    <Button variant="danger">
                      Activate the Giant Red Button
                    </Button>
                    <List />
                  </Tab>
                  <Tab eventKey="cue" title="Cue Stuff">
                    <Cues />
                    
       

                  </Tab>
                </Tabs>
              </Col>
            </Row>
            <Row>
            <input type="file" name="file" onChange={this.onChangeHandler}/>

            </Row>
          </Col>
        </Container>
        <StickyFooter
          bottomThreshold={50}
          normalStyles={{
            backgroundColor: "#999999",
            padding: "2rem"
          }}
          stickyStyles={{
            backgroundColor: "rgba(255,255,255,.8)",
            padding: "2rem"
          }}
        >
         Connected.
        </StickyFooter>
      </Wrapper>
    );
  }
}
export default Home;
