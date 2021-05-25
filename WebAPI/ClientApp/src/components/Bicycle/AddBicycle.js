import React, { Component } from "react";
import alertify from "alertifyjs";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import Select from 'react-select';
import '../../css/style.css';

export default class AddBicycle extends Component {
    state = {
        bicycleBrands: [],
        bicycleModels: [],
        customers: [],
        selectedBrand: 0,
        selectedModel: 0,
        selectedCustomer: 0,
        productionDate: 0,
        serialNumber: "",
    };

    componentDidMount() {
        this.getBicycleBrands();
        this.getCustomers();
    }

    handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        this.setState({ [name]: value });
    };

    handleChangeBrand = (event) => {
        this.state.selectedBrand = event.value;
        this.getBicycleModels(this.state.selectedBrand);
    }

    handleChangeModel = (event) => {
        this.state.selectedModel = event.value;
    }

    handleChangeCustomer = (event) => {
        this.state.selectedCustomer = event.value;
    }

    // Bisiklet Ekleme
    addBicycle = (event) => {
        event.preventDefault();

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                brandId: this.state.selectedBrand,
                modelId: this.state.selectedModel,
                ownerId: this.state.selectedCustomer,
                productionDate: this.state.productionDate,
                serialNumber: this.state.serialNumber,
            }),
        };

        fetch("/api/bicycles/add", requestOptions)
            .then(async (response) => {
                const data = await response.json();

                if (!response.ok) {
                    const error = data;
                    return Promise.reject(error);
                }

                Array.from(document.querySelectorAll("input")).forEach((input) => (input.value = ""));
                this.setState({
                    selectedBrand: 0,
                    selectedModel: 0,
                    selectedCustomer: 0,
                    serialNumber: "",
                });

                alertify.success(data.message);
                this.props.history.push("/bisiklet/listele");
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

    // Bisiklet Ekleme Formu
    addBicycleForm() {
        return (
            <Form onSubmit={this.addBicycle}>
                <FormGroup>
                    {this.CustomerSelect(this.state.customers)}
                </FormGroup>
                <FormGroup>
                    {this.BicycleBrandSelect(this.state.bicycleBrands)}
                </FormGroup>
                <FormGroup>
                    {this.BicycleModelSelect(this.state.bicycleModels)}
                </FormGroup>
                <FormGroup>
                    <Label for="productionDate">*Üretim Yılı</Label>
                    <Input type="number" name="productionDate" id="productionDate" onChange={this.handleChange} />
                </FormGroup>
                <FormGroup>
                    <Label for="serialNumber">Şase Numarası</Label>
                    <Input type="text" name="serialNumber" id="serialNumber" onChange={this.handleChange} />
                </FormGroup>
                <Button>Ekle</Button>
                <h6 className="RequiredField">Not: * ile işaretlenen alanların doldurulması zorunludur</h6>
            </Form>
        )
    }

    CustomerSelect(dizi = []) {
        let options = [];
        if (dizi.length != options.length) {
            for (let index = 0; index < dizi.length; index++) {
                options.push({ value: dizi[index].customerId, label: dizi[index].firstName + " " + dizi[index].lastName },)
            };
        }

        return <div>
            <Label for="customerSelect">*Müşteri</Label>
            <Select
                id="customerSelect"
                placeholder="Seçiniz"
                options={options}
                onChange={this.handleChangeCustomer}
            />
        </div>
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

    BicycleModelSelect(dizi = []) {
        let options = [];
        if (dizi.length != options.length) {
            for (let index = 0; index < dizi.length; index++) {
                options.push({ value: dizi[index].bicycleModelId, label: dizi[index].name },)
            };
        }

        return <div>
            <Label for="bicycleBrand">*Model</Label>
            <Select
                id="bicycleModel"
                placeholder="Seçiniz"
                options={options}
                onChange={this.handleChangeModel}
            />
        </div>
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

    //Bisiklet Modellerini Db'den Çekme
    getBicycleModels(id) {
        let token = localStorage.getItem('token');

        let url = "/api/bicyclemodels/getallbybrand?id=" + id;
        fetch(url, {
            method: 'get',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => response.json())
            .then((data) => this.setState({ bicycleModels: data }));
    };

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
            .then((response) => response.json())
            .then((data) => this.setState({ customers: data }));
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

    render() {
        return (
            <div>
                <center><h1>Bisiklet Ekle</h1></center>
                {this.addBicycleForm()}
            </div>
        );
    }
}
