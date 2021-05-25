import React, { Component } from "react";
import Container from "reactstrap/lib/Container";

export default class Logout extends Component {

  Logout(){
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: localStorage.getItem('refreshToken'),
      }),
    };

    fetch("/api/auth/RevokeRefreshToken", requestOptions);

    localStorage.clear();

    alert('Başarıyla çıkış yaptınız!');
    this.props.history.push("/kullanici/giris");
  }

  render() {
    return (
      <Container>
        {this.Logout()}
      </Container>
    );
  }
}
