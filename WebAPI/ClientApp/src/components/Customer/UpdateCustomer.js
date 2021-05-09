import React, { Component } from 'react';
import alertify from "alertifyjs";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";

export default class UpdateCustomer extends Component {

    state = {
        customer: [],
        firstName: "",
        lastName: "",
        phone: "",
        eMail: "",
        adress: ""
    };

    componentDidMount() {
        this.getCustomer(this.props.getCustomer);
    }

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

    //Müşteri Bilgisini Db'den Çekme
    getCustomer(id) {
        let token = localStorage.getItem('token');

        let url = "/api/customers/get?id=" + id;
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

                this.setState({ customer: data });

            })
            .catch((responseError) => {
                if (responseError.Message == "Token Bulunamadı!") {
                    this.CreateTokenByRefreshToken();
                }
            })
    };

    //Müşteri Bilgilerini Güncelleme
    updateCustomer = (event) => {
        event.preventDefault();

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                customerId: this.props.getCustomer,
                firstName: this.state.firstName != "" ? this.state.firstName : this.state.customer.firstName,
                lastName: this.state.lastName != "" ? this.state.lastName : this.state.customer.lastName,
                phone: this.state.phone != "" ? this.state.phone : this.state.customer.phone,
                eMail: this.state.eMail != "" ? this.state.eMail : this.state.customer.eMail,
                adress: this.state.adress != "" ? this.state.adress : this.state.customer.adress,
            }),
        };

        fetch("/api/customers/update", requestOptions)
            .then(async (response) => {
                const data = await response.json();

                if (!response.ok) {
                    const error = data;
                    return Promise.reject(error);
                }

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
                        alertify.error(responseError.Message);
                    }
                }
            });
    }

    //Müşteri güncelleme Form
    updateCustomerForm() {
        return (
            <Form onSubmit={this.updateCustomer}>
                <h1> Personel Bilgilerini Güncelle</h1>
                <FormGroup>
                    <Label for="firstName">Adı</Label>
                    <Input type="text" name="firstName" id="firstName" defaultValue={this.state.customer.firstName} onChange={this.handleChange} />
                </FormGroup>

                <FormGroup>
                    <Label for="lastName">Soyadı</Label>
                    <Input type="text" name="lastName" id="lastName" defaultValue={this.state.customer.lastName} onChange={this.handleChange} />
                </FormGroup>

                <FormGroup>
                    <Label for="phone">Telefon</Label>
                    <Input type="text" name="phone" id="phone" defaultValue={this.state.customer.phone} onChange={this.handleChange} />
                </FormGroup>

                <FormGroup>
                    <Label for="eMail">Email</Label>
                    <Input type="email" name="eMail" id="eMail" defaultValue={this.state.customer.eMail} onChange={this.handleChange} />
                </FormGroup>

                <FormGroup>
                    <Label for="adress">Adres</Label>
                    <Input type="adress" name="adress" id="adress" defaultValue={this.state.customer.adress} onChange={this.handleChange} />
                </FormGroup>

                <Button>Güncelle</Button>
            </Form>
        )
    }

    render() {
        return (
            <div>
                {this.updateCustomerForm()}
            </div>
        );
    }
};