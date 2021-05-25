import React, { Component } from 'react';
import { Container, Row, Col, } from "reactstrap";
import Menu from './Menu';
import '../css/style.css';

export class Layout extends Component {
  static displayName = Layout.name;

  render() {
    return (
      <div>
        <Row>
          <Col md="2" id="ab"><Menu /></Col>
          <Col md="10" className="pr-5">
            {this.props.children}
          </Col>
          
        </Row>


      </div>
    );
  }
}
