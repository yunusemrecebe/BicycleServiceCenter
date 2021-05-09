import React, { Component } from 'react';
import { Container, Row, Col, } from "reactstrap";

import Menu from './Menu';
import Menu2 from './menu2';

export class Layout extends Component {
  static displayName = Layout.name;

  render() {
    return (
      <div>
        <Row>
          <Col md="2"><Menu2 /></Col>
          <Col md="8">
            {this.props.children}
          </Col>
          <Col md="1"></Col>
        </Row>


      </div>
    );
  }
}
