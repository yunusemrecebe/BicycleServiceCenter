import React, { Component } from "react";
import alertify from "alertifyjs";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";

export default class AddEmployee extends Component {
    state = {
        firstName: "",
        lastName: "",
        phone: "",
    };

    //form verilerini state içerisine aktaran fonksiyon
    handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        this.setState({ [name]: value });
    };

    // Personel Ekleme
    addEmployee = (event) => {
        event.preventDefault();

        let token = localStorage.getItem('token');
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            },
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
                this.setState({
                    firstName: "",
                    lastName: "",
                    phone: "",
                });

                alertify.success(data.message);
                this.props.history.push("/personel/listele");
            })

            .catch((responseError) => {
                if (responseError.Errors) {
                    if (responseError.Errors.length > 0) {
                        for (let i = 0; i < responseError.Errors.length; i++) {
                            alertify.error(responseError.Errors[i].ErrorMessage);
                        }
                    }
                    else {
                        alertify.error(responseError);
                    }
                }
                else {
                    alertify.error(responseError.message);
                }
            });
    };

    // Personel Ekleme Formu
    addEmployeeForm() {
        return (
            <Form onSubmit={this.addEmployee}>
                <h1> Personel Ekle</h1>
                <FormGroup>
                    <Label for="firstName">Adı</Label>
                    <Input type="text" name="firstName" id="firstName" onChange={this.handleChange} />
                </FormGroup>

                <FormGroup>
                    <Label for="lastName">Soyadı</Label>
                    <Input type="text" name="lastName" id="lastName" onChange={this.handleChange} />
                </FormGroup>

                <FormGroup>
                    <Label for="phone">Telefon</Label>
                    <Input type="text" name="phone" id="phone" onChange={this.handleChange} />
                </FormGroup>

                <Button>Ekle</Button>
            </Form>
        )
    }

    CreateTokenByRefreshToken() {
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token: localStorage.getItem('refreshToken'),
            }),
        };

        fetch("/api/auth/CreateTokenByRefreshToken", requestOptions)
            .then(async (response) => {
                const data = await response.json();

                if (!response.ok) {
                    const error = data;
                    return Promise.reject(error);
                }

                localStorage.setItem('token', data.data.accessToken);
                localStorage.setItem('refreshToken', data.data.refreshToken);

                this.getEmployees();
            })

            .catch((responseError) => {

                if (responseError.message == "Refresh Token Bulunamadı!") {
                    alert('Bu işlemi gerçekleştirebilmek için giriş yapmalısınız!');
                    this.props.history.push("/girisYap")
                }
            });
    }


    render() {
        return (
            <div>
                {this.addEmployeeForm()}
            </div>
        );
    }
}
