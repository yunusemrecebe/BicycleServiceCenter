import React, { Component } from "react";
import alertify from "alertifyjs";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import Select from 'react-select';
import '../../css/style.css';

export default class AddBicycleModel extends Component {
    state = {
        bicycleModels: [],
        bicycleBrands: [],
        name: "",
        selectedBrand: 0,
    };

    componentDidMount() {
        this.getBicycleBrands();
    }

    //form verilerini state içerisine aktaran fonksiyon
    handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        this.setState({ [name]: value });
    };

    handleChangeBrand = (event) => {
        this.state.selectedBrand = event.value;
    }

    // Model Ekleme
    addBicycleModel = (event) => {
        event.preventDefault();

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                bicycleBrand: this.state.selectedBrand,
                name: this.state.name,
            }),
        };

        fetch("/api/bicyclemodels/add", requestOptions)
            .then(async (response) => {
                const data = await response.json();

                if (!response.ok) {
                    const error = data;
                    return Promise.reject(error);
                }

                Array.from(document.querySelectorAll("input")).forEach((input) => (input.value = ""));
                this.setState({ name: "", selectedBrand: 0 });

                alertify.success(data.message);
                this.props.history.push("/bisiklet/model/listele");
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

    // Model Ekleme Formu
    addBicycleModelForm() {
        return (
            <Form onSubmit={this.addBicycleModel}>
                <h1> Bisiklet Modeli Ekle</h1>
                <FormGroup>
                    <Label for="name">*Model Adı</Label>
                    <Input type="text" name="name" id="name" onChange={this.handleChange} />
                </FormGroup>

                <FormGroup>
                    {this.BicycleBrandSelect(this.state.bicycleBrands)}
                </FormGroup>

                <Button>Ekle</Button>
                <h6 className="RequiredField">Not: * ile işaretlenen alanların doldurulması zorunludur</h6>
            </Form>
        )
    }

    BicycleBrandSelect(dizi = []) {
        let options = [];
        if (dizi.length != options.length) {
            for (let index = 0; index < dizi.length; index++) {
                options.push({ value: dizi[index].bicycleBrandId, label: dizi[index].name },)
            };
        }

        return <div>
            <Label for="bicycleBrand">*Ait Olduğu Marka</Label>
            <Select
                id="bicycleBrand"
                placeholder="Seçiniz"
                options={options}
                onChange={this.handleChangeBrand}
            />
        </div>
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

                this.componentDidMount();
            })

            .catch((responseError) => {

                if (responseError.message == "Refresh Token Bulunamadı!") {
                    alert('Bu işlemi gerçekleştirebilmek için giriş yapmalısınız!');
                    this.props.history.push("/girisYap")
                }
            });
    }

    //Bisiklet Markalarını Db'den Çekme
    getBicycleBrands() {
        let token = localStorage.getItem('token');

        let url = "/api/bicyclebrands/getall";
        fetch(url, {
            method: 'get',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => response.json())
            .then((data) => this.setState({ bicycleBrands: data }));
    };

    render() {
        return (
            <div>
                {this.addBicycleModelForm()}
            </div>
        );
    }
}
