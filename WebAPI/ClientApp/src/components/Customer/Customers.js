import React, { Component, useState } from "react";
import alertify from "alertifyjs";
import { Button, Table, Row, Col, Form, FormGroup, Label, Input } from "reactstrap";

export default class Customers extends Component {
    state = {
        customers: [],
        firstName: "",
        lastName: "",
        phone: "",
        eMail: "",
        adress: ""
    };

    componentDidMount() {
        this.getCustomers();
    }

    //form verilerini state içerisine aktaran fonksiyon
    handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        this.setState({ [name]: value });
    };

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
                console.log(data);
                if (!response.ok) {
                    const error = data;
                    return Promise.reject(error);
                }

                localStorage.setItem('token', data.data.accessToken);
                localStorage.setItem('refreshToken', data.data.refreshToken);

                this.componentDidMount();
            })

            .catch((responseError) => {

                if (responseError.message == "Refresh Token Bulunamadı!") {
                    alert('Bu işlemi gerçekleştirebilmek için giriş yapmalısınız!');
                    this.props.history.push("/girisYap")
                }
            });
    }

    // Müşteri Ekleme
    addCustomer = (event) => {
        event.preventDefault();

        let token = localStorage.getItem('token');
        if (token == null) {
            alert('Bu işlemi gerçekleştirebilmek için giriş yapmalısınız!');
            this.props.history.push("/girisYap")
        }

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
                eMail: this.state.email,
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

                this.getCustomers();

                Array.from(document.querySelectorAll("input")).forEach((input) => (input.value = ""));
                this.setState({
                    firstName: "",
                    lastName: "",
                    phone: "",
                    eMail: "",
                    adress: "",
                });

                alertify.success(data.message);
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

    // Müşteri Ekleme Formu
    addCustomerForm() {
        return (
            <Form onSubmit={this.addCustomer}>
                <h1> Müşteri Ekle</h1>
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

                <FormGroup>
                    <Label for="eMail">Email</Label>
                    <Input type="email" name="eMail" id="eMail" onChange={this.handleChange} />
                </FormGroup>

                <FormGroup>
                    <Label for="adress">Adres</Label>
                    <Input type="adress" name="adress" id="adress" onChange={this.handleChange} />
                </FormGroup>

                <Button>Ekle</Button>
            </Form>
        )
    }

    //Müşterileri Db'den Çekme
    getCustomers() {
        let token = localStorage.getItem('token');

        let url = "/api/customers/getall";
        fetch(url, {
            method: 'get',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(async (response) => {
                const data = await response.json();

                if (!response.ok) {
                    const error = data;
                    return Promise.reject(error);
                }

                this.setState({ customers: data });

            })
            .catch((responseError) => {
                if (responseError.Message == "Token Bulunamadı!") {
                    this.CreateTokenByRefreshToken();
                }
            })
    };

    //Db'Den çekilmiş müşterileri listeleme
    ListCustomers() {
        return (
            <Table hover>
                <thead>
                    <tr>
                        <th>Ad Soyad</th>
                        <th>Telefon</th>
                        <th>EMail</th>
                        <th>Adres</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {this.state.customers.length > 0 ? this.state.customers.map((customer) => (
                        <tr key={customer.customerId}>
                            <td>{customer.firstName} {customer.lastName}</td>
                            <td>{customer.phone}</td>
                            <td>{customer.eMail}</td>
                            <td>{customer.adress}</td>
                            <td><Button onClick={this.deleteCustomer.bind(this, customer.customerId)} color="danger">Sil</Button></td>
                            <td><Button onClick={this.updateCustomer.bind(this, customer.customerId)} color="info">Güncelle</Button></td>
                        </tr>
                    ))
                        :
                        <h1>Sistemde kayıtlı müşteri bulunamadı!</h1>
                    }
                </tbody>
            </Table>
        )
    }

    //Müşteri Silme
    deleteCustomer(id) {

        let token = localStorage.getItem('token');
        if (token == null) {
            alert('Bu işlemi gerçekleştirebilmek için giriş yapmalısınız!');
            this.props.history.push("/girisYap")
        }

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            },
        };

        fetch("/api/customers/delete?id=" + id, requestOptions)
            .then(async (response) => {
                const data = await response.json();

                if (!response.ok) {
                    const error = data;
                    alertify.error(data.message);
                    return Promise.reject(error);
                }

                this.getCustomers();
                alertify.warning(data.message);
            })

            .catch((responseError) => {
                if (responseError.Errors) {
                    if (responseError.Errors.length > 0) {
                        for (let i = 0; i < responseError.Errors.length; i++) {
                            alertify.error(responseError.Errors[i].ErrorMessage);
                        }
                    }
                }
            });
    };

    //Müşteri güncellemek için Müşteri İd gönderen fonksiyon
    setCustomer = (id) => {
        this.props.setCustomer(id);
    }

    //Müşteri Güncelleme
    updateCustomer(id) {
        this.setCustomer(id);
        this.props.history.push("/müşteriGüncelle");
    };

    render() {
        return (
            <div>
                {this.addCustomerForm()}

                <Row>
                    <h1 className="text-center">Sistemde Kayıtlı Olan Müşteriler</h1>
                </Row>
                <Row>
                    <Col md="12">
                        {this.ListCustomers()}
                    </Col>
                </Row>

            </div>
        );
    }
}
