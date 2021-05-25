import React, { Component } from "react";
import alertify from "alertifyjs";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import '../../css/style.css';

export default class AddBicycleBrand extends Component {
    state = {
        name: "",
    };

    //form verilerini state içerisine aktaran fonksiyon
    handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        this.setState({ [name]: value });
    };

    // Marka Adı Ekleme
    addBicycleBrand = (event) => {
        event.preventDefault();

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: this.state.name,
            }),
        };

        fetch("/api/bicyclebrands/add", requestOptions)
            .then(async (response) => {
                const data = await response.json();

                if (!response.ok) {
                    const error = data;
                    return Promise.reject(error);
                }

                Array.from(document.querySelectorAll("input")).forEach((input) => (input.value = ""));
                this.setState({ name: "" });

                alertify.success(data.message);
                this.props.history.push("/bisiklet/marka/listele");
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

    // Marka Ekleme Formu
    addBicycleBrandForm() {
        return (
            <Form onSubmit={this.addBicycleBrand}>
                <h1> Bisiklet Markası Ekle</h1>
                <FormGroup>
                    <Label for="name">*Adı</Label>
                    <Input type="text" name="name" id="name" onChange={this.handleChange} />
                </FormGroup>

                <Button>Ekle</Button>
                <h6 className="RequiredField">Not: * ile işaretlenen alanların doldurulması zorunludur</h6>
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

    render() {
        return (
            <div>
                {this.addBicycleBrandForm()}
            </div>
        );
    }
}
