import React, { Component } from 'react';
import alertify from "alertifyjs";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";

export default class UpdateBicycle extends Component {

    state = {
        bicycles: [],
        bicycleBrands: [],
        bicycleModels: [],
        customers: [],
        selectedBrandId: 0,
        selectedModelId: 0,
        selectedCustomerId: 0,
        selectedBrandName: "",
        selectedModelName: "",
        selectedCustomerName: "",
        serialNumber: "",
        productionDate: 0,
    };

    componentDidMount() {
        this.getBicycleDetailsById(this.props.getBicycle);
        this.getBicycleBrands();
        this.getBicycleModels();
        this.getCustomers();
    }

    handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        this.setState({ [name]: value });
    };

    handleChangeBrand = (event) => {
        this.setState({ selectedBrandId: parseInt(event.target.value) });
    }

    handleChangeModel = (event) => {
        this.setState({ selectedModelId: parseInt(event.target.value) });
    }

    handleChangeCustomer = (event) => {
        this.setState({ selectedCustomerId: parseInt(event.target.value) });
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

    //Marka isimlerini Db'den Çekme
    getBicycleBrands() {
        let token = localStorage.getItem('token');

        let url = "/api/bicyclebrands/getall";
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

                this.setState({ bicycleBrands: data });

            })
            .catch((responseError) => {
                if (responseError.Message == "Token Bulunamadı!") {
                    this.CreateTokenByRefreshToken();
                }
            })
    };

    //Bisiklet Modellerini Db'den Çekme
    getBicycleModels() {
        let token = localStorage.getItem('token');

        let url = "/api/bicyclemodels/getall";
        fetch(url, {
            method: 'get',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => response.json())
            .then((data) => this.setState({ bicycleModels: data }));
    };

    //Müşterileri Db'den çekme
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

    //Bisiklet Detay Bilgisini Db'den Çekme (BicycleDetailDto)
    getBicycleDetailsById(id) {
        let token = localStorage.getItem('token');

        let url = "/api/bicycles/getdetailsbyid?id=" + id;
        fetch(url, {
            method: 'get',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => response.json())
            .then((data) => this.setState(
                {
                    bicycleId: data.bicycleId,
                    selectedBrandId: data.brandId,
                    selectedModelId: data.modelId,
                    selectedCustomerId: data.ownerId,
                    selectedBrandName: data.brandName,
                    selectedModelName: data.modelName,
                    selectedCustomerName: data.ownerName,
                    serialNumber: data.serialNumber,
                    productionDate: data.productionDate,
                    isLoaded: true,
                }));
    };

    //Bisiklet güncelleme
    updateBicycle = (event) => {
        event.preventDefault();

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                bicycleId: this.props.getBicycle,
                brandId: this.state.selectedBrandId,
                modelId: this.state.selectedModelId,
                ownerId: this.state.selectedCustomerId,
                serialNumber: this.state.serialNumber,
                productionDate: this.state.productionDate,
            }),
        };

        fetch("/api/bicycles/update", requestOptions)
            .then(async (response) => {
                const data = await response.json();

                if (!response.ok) {
                    const error = data;
                    return Promise.reject(error);
                }
                
                alertify.success(data.message);
                this.props.history.push("/bisikletler");
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

    //Bisiklet güncelleme Form
    updateBicycleForm() {
        return (
            <Form onSubmit={this.updateBicycle}>
                <h1>Bisiklet Güncelle</h1>

                <FormGroup>
                    <Label for="brand">Marka</Label>
                    <Input value={this.state.selectedBrandId} type="select" name="selectedBrandId" id="brand" onChange={this.handleChangeBrand}>
                        {this.state.bicycleBrands.map((bicycleBrand) => (
                            <option key={bicycleBrand.bicycleBrandId} value={bicycleBrand.bicycleBrandId}>{bicycleBrand.name}</option>
                        ))}
                    </Input>
                </FormGroup>

                <FormGroup>
                    <Label for="model">Model</Label>
                    <Input value={this.state.selectedModelId} type="select" name="selectedModelId" id="model" onChange={this.handleChangeModel}>
                        {this.state.bicycleModels.map((bicycleModel) => (
                            <option key={bicycleModel.bicycleModelId} value={bicycleModel.bicycleModelId} >{bicycleModel.name}</option>
                        ))}
                    </Input>
                </FormGroup>
                
                <FormGroup>
                    <Label for="owner">Sahip</Label>
                    <Input value={this.state.selectedCustomerId} type="select" name="selectedCustomerId" id="owner" onChange={this.handleChangeCustomer}>
                        {this.state.customers.map((customer) => (
                            <option key={customer.customerId} value={customer.customerId} >{customer.firstName} {customer.lastName}</option>
                        ))}
                    </Input>
                </FormGroup>

                <FormGroup>
                    <Label for="serialNumber">Şase Numarası</Label>
                    <Input type="text" name="serialNumber" id="serialNumber" defaultValue={this.state.serialNumber} onChange={this.handleChange} />
                </FormGroup>
                {this.state.isLoaded == true ?
                <FormGroup>
                    <Label for="productionDate">Üretim Yılı</Label>
                    <Input type="number" name="productionDate" id="productionDate" defaultValue={this.state.productionDate} onChange={this.handleChange} />
                </FormGroup>

                    :
                    null
                    }

                <Button>Güncelle</Button>
            </Form>
        )
    }

    render() {
        return (
            <div>
                {this.updateBicycleForm()}
            </div>
        );
    }
};