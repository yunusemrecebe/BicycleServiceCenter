import React, { Component, useState } from "react";
import alertify from "alertifyjs";
import { Button, Table, Row, Col, Form, FormGroup, Label, Input } from "reactstrap";

export default class UpdateInventory extends Component {
    state = {
        inventoryId: 0,
        productId: 0,
        product: "",
        purchasePrice: 0.0,
        sellPrice: 0.0,
        unitsInStock: 0,
        status: "",
        isLoaded: false
    };

    componentDidMount() {
        this.getInventoryById(this.props.getInventory);
    }

    handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        this.setState({ [name]: value });
    };

    handleChangeBicycle = (event) => {
        this.setState({ selectedBicycle: parseInt(event.target.value) });
    }

    handleChangeEmployee = (event) => {
        this.setState({ selectedEmployee: parseInt(event.target.value) });
    }

    handleChangeCustomer = (event) => {
        this.setState({ isLoaded: true });
        this.state.selectedCustomer = document.getElementById("owner").value;
        this.getBicycles(this.state.selectedCustomer);
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

                if (responseError.message == "Refresh Token Bulunamad??!") {
                    alert('Bu i??lemi ger??ekle??tirebilmek i??in giri?? yapmal??s??n??z!');
                    this.props.history.push("/girisYap")
                }
            });
    }

    //Envantere g??ncelleme
    updateInventory = (event) => {
        event.preventDefault();

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                inventoryId: this.state.inventoryId,
                productId: this.state.productId,
                product: this.state.product,
                purchasePrice: this.state.purchasePrice,
                sellPrice: this.state.sellPrice,
                unitsInStock: this.state.unitsInStock,
            }),
        };

        fetch("/api/inventory/update", requestOptions)
            .then(async (response) => {
                const data = await response.json();

                if (!response.ok) {
                    const error = data;
                    return Promise.reject(error);
                }

                Array.from(document.querySelectorAll("input")).forEach((input) => (input.value = ""));
                this.setState({
                    inventoryId: 0,
                    productId: 0,
                    product: "",
                    purchasePrice: 0.0,
                    sellPrice: 0.0,
                    unitsInStock: 0,
                    status: ""
                });

                alertify.success(data.message);
                this.props.history.push("/stok/listele");
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

    //Envantere g??ncelleme Formu
    updateInventoryForm() {
        return (
            <Form onSubmit={this.updateInventory}>
                <Row className="mt-3">
                    <Col md={3}></Col>
                    <Col md={6}>
                        <h1> {this.state.product}</h1>
                    </Col>
                    <Col md={3}></Col>
                </Row>
                {this.state.isLoaded ?

                    <Row className="mt-5">
                        <Col md={3}>
                            <FormGroup>
                                <Label for="purchasePrice">Al???? Fiyat??</Label>
                                <Input type="number" name="purchasePrice" id="purchasePrice" defaultValue={this.state.purchasePrice} onChange={this.handleChange} min="0.00" step="0.001" max="9999999.0000" presicion={4} />
                            </FormGroup>
                        </Col>

                        <Col md={3}>
                            <FormGroup>
                                <Label for="sellPrice">Sat???? Fiyat??</Label>
                                <Input type="number" name="sellPrice" id="sellPrice" defaultValue={this.state.sellPrice} onChange={this.handleChange} />
                            </FormGroup>
                        </Col>

                        <Col md={3}>
                            <FormGroup>
                                <Label for="unitsInStock">Stoktaki Miktar</Label>
                                <Input type="number" name="unitsInStock" id="unitsInStock" defaultValue={this.state.unitsInStock} onChange={this.handleChange} min="0" />
                            </FormGroup>
                        </Col>

                        <Col md={2} className="mt-4">
                            <Button>G??ncelle</Button>
                        </Col>
                    </Row>
                    :
                    null
                }
            </Form>
        )
    }

    //Envanteri Db'den ??ekme
    getInventoryById(id) {
        let token = localStorage.getItem('token');
        if (token == null) {
            alert('Bu sayfay?? g??r??nt??leyebilmek i??in giri?? yapmal??s??n??z!');
            this.props.history.push("/girisYap")
        }

        let url = "/api/inventory/getdetailsbyid?id=" + id;
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

                this.setState({
                    inventoryId: data.inventoryId,
                    productId: data.productId,
                    product: data.product,
                    purchasePrice: data.purchasePrice,
                    sellPrice: data.sellPrice,
                    unitsInStock: data.unitsInStock,
                    status: data.status,
                    isLoaded: true,
                });

            })
            .catch((responseError) => {
                if (responseError.Message == "Token Bulunamad??!") {
                    this.CreateTokenByRefreshToken();
                }
            })
    };

    render() {
        return (
            <div>
                {console.log(this.state.purchasePrice)}
                {this.updateInventoryForm()}

            </div>
        );
    }
}
