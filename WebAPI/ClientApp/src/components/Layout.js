import React, { Component } from 'react';
import {Container, Row, Col,} from "reactstrap";
import { NavMenu } from './NavMenu';
import Menu from './Menu';

export class Layout extends Component {
  static displayName = Layout.name;

  render() {
    return (
      <div>
        <NavMenu />
        <Row>
          <Col md="2"><Menu /></Col>
          <Col md="10">
            <Container>
              {this.props.children}
            </Container>
          </Col>
        </Row>
        
        
      </div>
    );
  }
}
