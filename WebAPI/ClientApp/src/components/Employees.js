import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  ListGroup,
  ListGroupItem,
} from "reactstrap";

export default class Employees extends Component {
  state = {
    employees: [],
  };

  componentDidMount() {
    this.getEmployees();
  }

  getEmployees() {
    let url = "/api/employee/getall";
    fetch(url)
      .then((response) => response.json())
      .then((data) => this.setState({ employees: data }));
  }

  render() {
    return (
      <div>
            <Row>
                <h1>Personeller</h1>
          <Col md="2"></Col>
          <Col md="8">
                    <ListGroup>
                        {this.state.employees.map((emp) => (
                            <ListGroupItem className="mb-3">{emp.firstName + " " + emp.lastName}</ListGroupItem>
                        ))}
                    </ListGroup>
          </Col>
          <Col md="2"></Col>
        </Row>
      </div>
    );
  }
}