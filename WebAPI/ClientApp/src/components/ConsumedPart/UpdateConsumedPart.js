import React, { Component } from 'react';
import alertify from "alertifyjs";
import { Button, Form, FormGroup, Label, Input, Row, Col, Table } from "reactstrap";

export default class UpdateProcess extends Component {

    state = {
        consumedParts: [],
        quantity: 0,
        discount: 0,
    };

    componentDidMount() {
        this.getConsumedParts(this.props.getProcess);
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

        let url = "/api/consumedparts/getdetailsbyprocessid?id=" + id;
        fetch(url, {
            method: 'get',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => response.json())
            .then((data) => this.setState({ consumedParts: data }));
    };

    //Kullanılan ürün ekleme
    addConsumedPart = (event) => {
        event.preventDefault();

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                processId: this.state.selectedProcessId,
                productId: this.state.selectedProduct,
                quantity: this.state.quantity,
                discount: this.state.discount,
            }),
        };

        fetch("/api/consumedparts/add", requestOptions)
            .then(async (response) => {
                const data = await response.json();

                if (!response.ok) {
                    const error = data;
                    return Promise.reject(error);
                }

                Array.from(document.querySelectorAll("input")).forEach((input) => (input.value = ""));
                this.setState({
                    selectedProductCategoryId: 0,
                    selectedProduct: 0,
                    productId: 0,
                    quantity: 0,
                    discount: 0,
                });

                alertify.success(data.message);
                this.getConsumedParts(this.props.getProcess);
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

    //Kullanılan ürün ekleme formu
    addConsumedPartForm() {
        return (
            <Form onSubmit={this.addConsumedPart}>
                <h1> Kullanılan Ürün Ekle</h1>
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
                            <th scope="row">Ürün Kategorisi</th>
                            <td>
                                <Input value={this.state.selectedProductCategoryId} type="select" name="productCategory" id="productCategory" onChange={this.handleChangeProductCategory}>
                                    <option selected value={0}>Seçiniz</option>
                                    {this.state.productCategories.map((category) => (
                                        <option key={category.productCategoryId} value={category.productCategoryId}>{category.name}</option>
                                    ))}
                                </Input>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">Ürün</th>
                            <td>
                                <Input value={this.state.selectedProduct} type="select" name="product" id="product" onChange={this.handleChangeProduct}>
                                    <option selected value={0}>Seçiniz</option>
                                    {this.state.products.map((product) => (
                                        <option key={product.productId} value={product.productId}>{product.brandName} - {product.productName}</option>
                                    ))}
                                </Input>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">Adet</th>
                            <td>
                                <Input type="number" name="quantity" id="quantity" defaultValue={0} min={0} onChange={this.handleChange}></Input>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">İndirim Oranı</th>
                            <td>
                                <Input type="number" name="discount" id="discount" defaultValue={0} min={0} onChange={this.handleChange}></Input>
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
                <Row>
                    <Col md="6">
                        {this.addConsumedPartForm()}
                    </Col>
                </Row>
                {this.ListConsumedParts()}

            </div>
        );
    }
};