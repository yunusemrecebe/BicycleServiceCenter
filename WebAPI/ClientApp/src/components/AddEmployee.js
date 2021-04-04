import React, { Component } from "react";
import Container from "reactstrap/lib/Container";
import alertify from "alertifyjs";

export default class AddEmployee extends Component {
  state = { firstName: "", lastName: "", phone: "", validationError: "" };

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
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        phone: this.state.phone,
      }),
    };

    fetch("/api/employees/add", requestOptions)
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          const error = data;
          return Promise.reject(error);
        }

        Array.from(document.querySelectorAll("input")).forEach((input) => (input.value = ""));
        this.setState({ firstName: "", lastName: "", phone: "" });
        alertify.success("Personel Eklendi!");
      })

      .catch((responseError) => {
        if (responseError.Errors) {
          if (responseError.Errors.length > 0) {
            for (let i = 0; i < responseError.Errors.length; i++) {
              alertify.error(responseError.Errors[i].ErrorMessage);
            }
          }
        }
        else{
          alertify.error("Tüm alanlar doldurulmalı.")
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

          <label htmlFor="phone">Telefon</label>
          <input
            id="phone"
            onChange={this.handleChange}
            name="phone"
            type="number"
          />

          <button>Kaydet</button>
        </form>
      </Container>
    );
  }
}
