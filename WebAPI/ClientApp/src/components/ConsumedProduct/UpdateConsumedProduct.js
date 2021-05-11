import React, { Component } from 'react';
import alertify from "alertifyjs";
import { Button, Form, Input, Row, Col, Table } from "reactstrap";

export default class UpdateConsumedProducts extends Component {

    state = {
        consumedProductId: 0,
        processId: 0,
        productId: 0,
        productCode: "",
        product: "",
        unitPrice: 0,
        totalPrice: 0,
        quantity: 0,
        discount: 0,
        isLoaded: false
    };

    componentDidMount() {
        this.getConsumedProducts(this.props.getConsumedProduct);
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

    //Kullanılan Ürünleri Db'den çekme
    getConsumedProducts(id) {
        let token = localStorage.getItem('token');

        let url = "/api/consumedproducts/getdetailsbyid?id=" + id;
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
                consumedProductId: data.consumedProductId,
                processId: data.processId,
                productId: data.productId,
                productCode: data.productCode,
                product: data.product,
                unitPrice: data.unitPrice,
                totalPrice: data.totalPrice,
                quantity: data.quantity,
                discount: data.discount,
                isLoaded: true
             });

        })
        .catch((responseError) => {
            if (responseError.Message == "Token Bulunamadı!") {
                this.CreateTokenByRefreshToken();
            }
        })
    };

    //Kullanılan ürün güncelleme
    updateConsumedProduct = (event) => {
        event.preventDefault();

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                consumedProductId: this.state.consumedProductId,
                processId: this.state.processId,
                productId: this.state.productId,
                unitPrice: this.state.unitPrice,
                quantity: this.state.quantity,
                discount: this.state.discount,
            }),
        };

        fetch("/api/consumedproducts/update", requestOptions)
            .then(async (response) => {
                const data = await response.json();

                if (!response.ok) {
                    const error = data;
                    return Promise.reject(error);
                }

                alertify.success(data.message);
                this.props.history.goBack();
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

    //Kullanılan ürün güncelleme formu
    updateConsumedProductForm() {
        return (
            <Form onSubmit={this.updateConsumedProduct}>
                <Table borderless>
                    <thead>
                        <tr>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>

                        <tr>
                            <th scope="row">Ürün</th>
                            <td>
                                <Input value={this.state.product} type="text" name="product" id="product"></Input>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">Ürün Kodu</th>
                            <td>
                                <Input value={this.state.productCode} type="text" name="productCode" id="productCode"></Input>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">Adet</th>
                            <td>
                                {this.state.isLoaded == true ?
                                    <Input type="number" name="quantity" id="quantity" defaultValue={this.state.quantity} min={0} onChange={this.handleChange}></Input>
                                    :
                                    null
                                }
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">İndirim Oranı</th>
                            <td>
                                {this.state.isLoaded == true ?
                                    <Input type="number" name="discount" id="discount" defaultValue={this.state.discount} min={0} onChange={this.handleChange}></Input>
                                    :
                                    null
                                }
                            </td>
                        </tr>

                    </tbody>
                </Table>
                <Button>Ekle</Button>
            </Form>
        )
    }

    render() {
        return (
            <div>
                <h1 className="text-center"> Kullanılan Ürün Bilgilerini Güncelle</h1>
                <Row>
                    <Col md="6">
                        {this.updateConsumedProductForm()}
                    </Col>
                </Row>

            </div>
        );
    }
};