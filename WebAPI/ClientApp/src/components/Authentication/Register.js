import React, { Component } from "react";
import { Button, Row, Col, Form, FormGroup, Label, Input } from "reactstrap";
import alertify from "alertifyjs";

export default class Register extends Component {
  state = { eMail: "", password: "", firstName: "", lastName: "" };

  handleChange = (event) => {
    let name = event.target.name;
    let value = event.target.value;
    this.setState({ [name]: value });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eMail: this.state.eMail,
        password: this.state.password,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
      }),
    };

    fetch("/api/auth/register", requestOptions)
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          const error = data;
          return Promise.reject(error);
        }

        Array.from(document.querySelectorAll("input")).forEach((input) => (input.value = ""));
        this.setState({ eMail: "", password: "", firstName: "", lastName: "" });

        alertify.success("Kayıt Olundu!");
      })

      .catch((responseError) => {
        if (responseError.Errors) {
          if (responseError.Errors.length > 0) {
            for (let i = 0; i < responseError.Errors.length; i++) {
              alertify.error(responseError.Errors[i].ErrorMessage);
            }
          }
        }
        if (responseError.Message) {
          console.log("bişey")
          //alertify.error(responseError.message)
        }
        else {
          alertify.error("Hat'a!")
        }
      });
  };

  render() {
    return (
      <Row className="mt-3">
        <Col md="2"></Col>
        <Col md="8">
          <Form onSubmit={this.handleSubmit}>
          <h1 className="text-center mb-5">Kayıt Ol</h1>
            <FormGroup>
              <Label htmlFor="firstName">İsim</Label>
              <Input id="firstName" onChange={this.handleChange} name="firstName" type="text"></Input>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="lastName">Soyisim</Label>
              <Input id="lastName" onChange={this.handleChange} name="lastName" type="text"></Input>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="eMail">Email</Label>
              <Input id="eMail" onChange={this.handleChange} name="eMail" type="email"></Input>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="password">Parola</Label>
              <Input id="password" onChange={this.handleChange} name="password" type="password"></Input>
            </FormGroup>

            <Button>Kayıt Ol</Button>
          </Form>
        </Col>
        <Col md="2"></Col>
      </Row>
    );
  }
}
