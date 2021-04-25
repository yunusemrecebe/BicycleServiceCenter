import React, { Component } from 'react';
import alertify from "alertifyjs";
import { Button, Form, Input, Row, Col, Table } from "reactstrap";

export default class UpdateConsumedParts extends Component {

    state = {
        consumedPartId: 0,
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
        this.getConsumedParts(this.props.getConsumedPart);
    }

    handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        this.setState({ [name]: value });
    };

    //Kullanılan Ürünleri Db'den çekme
    getConsumedParts(id) {
        let token = localStorage.getItem('token');
        if (token == null) {
            alert('Bu sayfayı görüntüleyebilmek için giriş yapmalısınız!');
            this.props.history.push("/girisYap")
        }

        let url = "/api/consumedparts/getdetailsbyid?id=" + id;
        fetch(url, {
            method: 'get',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => response.json())
            .then((data) => this.setState({
                consumedPartId: data.consumedPartId,
                processId: data.processId,
                productId: data.productId,
                productCode: data.productCode,
                product: data.product,
                unitPrice: data.unitPrice,
                totalPrice: data.totalPrice,
                quantity: data.quantity,
                discount: data.discount,
                isLoaded: true
            }));
    };

    //Kullanılan ürün güncelleme
    updateConsumedPart = (event) => {
        event.preventDefault();

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                consumedPartId: this.state.consumedPartId,
                processId: this.state.processId,
                productId: this.state.productId,
                unitPrice: this.state.unitPrice,
                quantity: this.state.quantity,
                discount: this.state.discount,
            }),
        };

        fetch("/api/consumedparts/update", requestOptions)
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
    updateConsumedPartForm() {
        return (
            <Form onSubmit={this.updateConsumedPart}>
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
                        {this.updateConsumedPartForm()}
                    </Col>
                </Row>

            </div>
        );
    }
};