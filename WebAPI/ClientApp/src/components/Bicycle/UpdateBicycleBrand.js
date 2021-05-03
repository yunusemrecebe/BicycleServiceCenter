import React, { Component } from 'react';
import alertify from "alertifyjs";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";

export default class UpdateBicycleBrand extends Component {

    state = {
        bicycleBrand: [],
        name: "",
    };

    componentDidMount() {
        this.getBicycleBrand(this.props.getBicycleBrand);
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

    //Marka isimlerini Db'den Çekme
    getBicycleBrand(id) {
        let token = localStorage.getItem('token');

        let url = "/api/bicyclebrands/get?id=" + id;
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

                this.setState({ bicycleBrand: data });

            })
            .catch((responseError) => {
                if (responseError.Message == "Token Bulunamadı!") {
                    this.CreateTokenByRefreshToken();
                }
            })
    };

    //Marka Bilgilerini Güncelleme
    updateBicycleBrand=(event)=>{
        event.preventDefault();
        
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                bicycleBrandId: this.props.getBicycleBrand,
                name: this.state.name != "" ? this.state.name : this.state.bicycleBrand.name,
            }),
        };
        
        fetch("/api/bicyclebrands/update", requestOptions)
            .then(async (response) => {
                
                const data = await response.json();

                if (!response.ok) {
                    const error = data;
                    return Promise.reject(error);
                }

                alertify.success(data.message);
                this.props.history.push("/bisikletMarkası");
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
    }

    //Müşteri güncelleme Form
    updateBicycleBrandForm() {
        return (
            <Form onSubmit={this.updateBicycleBrand}>
                <h1> Bisiklet Markası Bilgilerini Güncelle</h1>
                <FormGroup>
                    <Label for="name">Adı</Label>
                    <Input type="text" name="name" id="name" defaultValue={this.state.bicycleBrand.name} onChange={this.handleChange} />
                </FormGroup>

                <Button>Güncelle</Button>
            </Form>
        )
    }

    render() {
        return (
            <div>
                {this.updateBicycleBrandForm()}
            </div>
        );
    }
};