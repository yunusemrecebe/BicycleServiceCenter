import React, { Component } from "react";
import Container from "reactstrap/lib/Container";
import alertify from "alertifyjs";

export default class AddEmployee extends Component {

  handleChange = (event) => {
    let name = event.target.name;
    let value = event.target.value;
    this.setState({ [name]: value });
  };

  handleSubmit = (event) => {
    event.preventDefault();

  }

  Logout(){
    localStorage.removeItem('token');
    alert('Başarıyla çıkış yaptınız!');
    this.props.history.push("/login");
  }

  render() {
    return (
      <Container>
        {this.Logout()}
      </Container>
    );
  }
}
