import React, { Component } from 'react';
import alertify from "alertifyjs";
import { FormGroup } from "reactstrap";

export default class UpdateProductBrand extends Component {

    state = {
        productBrand: [],
        name: "",
        id: "",
    };

    componentDidMount() {
        this.getProductBrandsById(this.props.getProductBrand);
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

    //Marka Bilgisini Db'den Çekme
    getProductBrandsById(id) {
        let token = localStorage.getItem('token');

        let url = "/api/productbrands/get?id=" + id;
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

                this.setState({ productBrand: data });

            })
            .catch((responseError) => {
                if (responseError.Message == "Token Bulunamadı!") {
                    this.CreateTokenByRefreshToken();
                }
            })
    };

    updateProduct = (event) => {
        event.preventDefault();

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: this.state.name,
                productBrandId: this.props.getProductBrand,
            }),
        };

        fetch("/api/productbrands/update", requestOptions)
            .then(async (response) => {
                const data = await response.json();

                if (!response.ok) {
                    const error = data;
                    return Promise.reject(error);
                }

                alertify.success(data.message);
                this.props.history.push("/urun/marka/listele");
            })

            .catch((responseError) => {
                if (responseError.Errors) {
                    if (responseError.Errors.length > 0) {
                        for (let i = 0; i < responseError.Errors.length; i++) {
                            alertify.error(responseError.Errors[i].ErrorMessage);
                        }
                    }
                    else {
                        alertify.error(responseError.message);
                    }
                }
            });
    }

    render() {
        return (
            <div>
                <form onSubmit={this.updateProduct}>
                    <FormGroup>
                        <label htmlFor="name">Marka Adı</label>
                        <input type="text" id="name" name="name" defaultValue={this.state.productBrand.name} onChange={this.handleChange}></input>
                        <button type="submit">Ekle</button>
                    </FormGroup>
                </form>
            </div>
        );
    }
};