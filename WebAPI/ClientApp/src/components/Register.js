import React, { Component } from "react";
import Container from "reactstrap/lib/Container";
import alertify from "alertifyjs";

export default class AddEmployee extends Component {
  state = { eMail: "", password: "", firstName: "", lastName: "", validationError: "" };

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
        this.setState({ eMail: "", password: "", firstName: "", lastName: ""});
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
        if(responseError.Message){
            console.log("bişey")
          //alertify.error(responseError.message)
        }
        else{
          alertify.error("Hat'a!")
        }
      });
  };

  render() {
    return (
      <Container>
        <div id="12">{this.state.validationError}</div>
        <form onSubmit={this.handleSubmit}>
        <label htmlFor="firstName">İsim</label>
          <input
            id="firstName"
            onChange={this.handleChange}
            name="firstName"
            type="text"
          />

        <label htmlFor="lastName">Soyisim</label>
          <input
            id="lastName"
            onChange={this.handleChange}
            name="lastName"
            type="text"
          />

          <label htmlFor="eMail">EMail</label>
          <input
            id="eMail"
            onChange={this.handleChange}
            name="eMail"
            type="text"
          />

          <label htmlFor="password">Parola</label>
          <input
            id="password"
            onChange={this.handleChange}
            name="password"
            type="password"
          />

          <button>Kayıt Yap</button>
        </form>
      </Container>
    );
  }
}
