import React, { Component } from "react";
import { Button, Row, Col, Form, FormGroup, Label, Input } from "reactstrap";
import alertify from "alertifyjs";

export default class Login extends Component {
  state = { eMail: "", password: "" };

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
      }),
    };

    fetch("/api/auth/login", requestOptions)
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          const error = data;
          return Promise.reject(error);
        }
        
        localStorage.setItem('token', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);

        Array.from(document.querySelectorAll("input")).forEach((input) => (input.value = ""));
        this.setState({ eMail: "", password: "" });

        alertify.success(data.message);
        this.props.history.push("/");
      })

      .catch((responseError) => {
        console.log(responseError);
        if (responseError.Errors) {
          if (responseError.Errors.length > 0) {
            for (let i = 0; i < responseError.Errors.length; i++) {
              alertify.error(responseError.Errors[i].ErrorMessage);
            }
          }
        }
        else if (responseError.message) {
          alertify.error(responseError.message);
        }
        else if (responseError.StatusCode == 500) {
          alertify.error("Bir hata oluştu!");
        }
      });
  };

  render() {
    return (

      <Row className="mt-3">
        <Col md="2"></Col>

        <Col md="8">
          <h1 className="text-center mb-5">Giriş Yap</h1>
          <Form onSubmit={this.handleSubmit}>
            <FormGroup>
              <Label htmlFor="eMail">Email</Label>
              <Input id="eMail" onChange={this.handleChange} name="eMail" type="text"></Input>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="password">Parola</Label>
              <Input id="password" onChange={this.handleChange} name="password" type="password"></Input>
            </FormGroup>

            <center><Button>Giriş Yap</Button></center>
          </Form>
        </Col>

        <Col md="2"></Col>

      </Row>
    );
  }
}
