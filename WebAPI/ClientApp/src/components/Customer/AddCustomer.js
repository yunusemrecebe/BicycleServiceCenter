import React, { Component } from "react";
import { Button, Form, Table, Input } from "reactstrap";
import alertify from "alertifyjs";

export default class Customers extends Component {
    state = {
        firstName: "",
        lastName: "",
        phone: "",
        eMail: null,
        adress: null,
    };

    handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        this.setState({ [name]: value });
    };

    // Müşteri Ekleme
    addCustomer = (event) => {
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
                eMail: this.state.eMail,
                adress: this.state.adress,
            }),
        };

        fetch("/api/customers/add", requestOptions)
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
                    eMail: "",
                    adress: "",
                });

                alertify.success(data.message);
                this.props.history.push("/musteri/listele");
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

    render() {
        return (
            <Form onSubmit={this.addCustomer}>
                <center><h1>Müşteri Ekle</h1></center>
                <Table borderless>
                    <thead>
                        <tr>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope="row">Adı</th>

                            <td>
                                <Input type="text" name="firstName" id="firstName" onChange={this.handleChange} />
                            </td>
                        </tr>

                        <tr>
                            <th scope="row">Soyadı</th>

                            <td>
                                <Input type="text" name="lastName" id="lastName" onChange={this.handleChange} />
                            </td>
                        </tr>

                        <tr>
                            <th scope="row">Telefon</th>

                            <td>
                                <Input type="text" name="phone" id="phone" onChange={this.handleChange} />
                            </td>
                        </tr>

                        <tr>
                            <th scope="row">Email</th>

                            <td>
                                <Input type="email" name="eMail" id="eMail" onChange={this.handleChange} />
                            </td>
                        </tr>

                        <tr>
                            <th>Adres</th>

                            <td>
                                <Input type="adress" name="adress" id="adress" onChange={this.handleChange} />
                            </td>
                        </tr>

                    </tbody>
                </Table>

                <Button>Ekle</Button>
            </Form>
        );
    }
}
