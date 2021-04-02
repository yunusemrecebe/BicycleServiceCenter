import React, { Component } from "react";
import Container from "reactstrap/lib/Container";

export default class AddEmployee extends Component {
  state = { firstName: "", lastName: "", phone: "" };

  handleChange = (event) => {
    let name = event.target.name;
    let value = event.target.value;
    this.setState({ [name]: value });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    fetch("/api/employees/add", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        phone: this.state.phone,
      }),
    })
      .then(response => {
        if (response.ok) {
          Array.from(document.querySelectorAll("input")).forEach(
            input => (input.value = "")
          );
            this.setState({ firstName: "", lastName: "", phone: "" });
            alert('Personel Eklendi!');
          return response.json();
        } else {
          alert('Bir Hata Oluþtu!');
        }});
      
  };

  render() {
    return (
      <Container>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="firstName">Ýsim</label>
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
