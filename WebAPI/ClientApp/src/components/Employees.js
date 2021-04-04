import React, { Component } from "react";
import { Redirect } from "react-router";
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
    let token = localStorage.getItem('token');
    if(token == null){
      alert('Bu sayfayı görüntüleyebilmek için giriş yapmalısınız!');
      this.props.history.push("/login")
    }
    
    let url = "/api/employees/getall";
    fetch(url, {
      method: 'get',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((response) => response.json())
      .then((data) => this.setState({ employees: data }));
  };

  render() {
    return (
      <div>
            <Row>
                <h1>Personeller</h1>
          <Col md="2"></Col>
          <Col md="8">
                    <ListGroup>
                        {this.state.employees.map((emp) => (
                            <ListGroupItem key={emp.employeeId} className="mb-3">{emp.firstName + " " + emp.lastName}</ListGroupItem>
                        ))}
                    </ListGroup>
          </Col>
          <Col md="2"></Col>
        </Row>
      </div>
    );
  }
}
