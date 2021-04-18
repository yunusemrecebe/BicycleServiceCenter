import React, { Component } from 'react';
import alertify from "alertifyjs";
import { Button, Form, FormGroup, Label, Input, Row, Col } from "reactstrap";

export default class UpdateProcess extends Component {

    state = {
        productCategories: [],
        products: [],
        selectedProductCategoryId: 0,
        selectedProduct: 0,
        quantity: 0,
        discount: 0,
        selectedProcessId: 0,
    };

    componentDidMount() {
        this.getProductCategories();
    }

    handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        this.setState({ [name]: value });
    };

    handleChangeBicycle = (event) => {
        this.setState({ selectedBicycleId: parseInt(event.target.value) });
    }

    handleChangeEmployee = (event) => {
        this.setState({ selectedEmployeeId: parseInt(event.target.value) });
    }

    handleChangeCustomer = (event) => {
        this.state.selectedCustomerId = document.getElementById("owner").value;
        this.getBicyclesByCustomer(this.state.selectedCustomerId);
    }

    handleChangeProductCategory = (event) => {
        this.state.selectedProductCategoryId = document.getElementById("productCategory").value;
        this.getProductsByCategory(this.state.selectedProductCategoryId);
    }

    handleChangeProduct = (event) => {
        this.setState({ selectedProduct: parseInt(event.target.value) });
    }

    //Ürün Kategorilerini Db'den çekme
    getProductCategories() {
        let token = localStorage.getItem('token');
        if (token == null) {
            alert('Bu sayfayı görüntüleyebilmek için giriş yapmalısınız!');
            this.props.history.push("/girisYap")
        }

        let url = "/api/productcategories/getall";
        fetch(url, {
            method: 'get',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => response.json())
            .then((data) => this.setState({ productCategories: data }));
    };

    //Ürünleri Kategorilere göre Db'den çekme
    getProductsByCategory(id) {
        let token = localStorage.getItem('token');
        if (token == null) {
            alert('Bu sayfayı görüntüleyebilmek için giriş yapmalısınız!');
            this.props.history.push("/girisYap")
        }

        let url = "/api/products/getallbycategoryid?id=" + id;
        fetch(url, {
            method: 'get',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => response.json())
            .then((data) => this.setState({ products: data }));
    };

    addConsumedPart() {
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

                alertify.success(data.message);
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
    addConsumedPartForm() {
        return (
            <Form onSubmit={this.addConsumedPart}>
                <h1> Kullanılan Ürünleri Ekle </h1>
                <Row>
                    <Col md={3}>
                        <FormGroup>
                            <Label for="productCategory">Ürün Kategorisi</Label>
                            <Input value={this.state.selectedProductCategoryId} type="select" name="productCategory" id="productCategory" onChange={this.handleChangeProductCategory}>
                                <option selected value={0}>Seçiniz</option>
                                {this.state.productCategories.map((category) => (
                                    <option key={category.productCategoryId} value={category.productCategoryId}>{category.name}</option>
                                ))}
                            </Input>
                        </FormGroup>
                    </Col>

                    <Col md={3}>
                        <FormGroup>
                            <Label for="product">Ürün</Label>
                            <Input value={this.state.selectedProduct} type="select" name="product" id="product" onChange={this.handleChangeProduct}>
                                <option selected value={0}>Seçiniz</option>
                                {this.state.products.map((product) => (
                                    <option key={product.productId} value={product.productId}>{product.brandName} - {product.productName}</option>
                                ))}
                            </Input>
                        </FormGroup>
                    </Col>

                    <Col md={3}>
                        <FormGroup>
                            <Label for="quantity">Adet</Label>
                            <Input type="number" name="quantity" id="quantity" min={0} onChange={this.handleChange}></Input>
                        </FormGroup>
                    </Col>

                    <Col md={3}>
                        <FormGroup>
                            <Label for="discount">İndirim Oranı</Label>
                            <Input type="number" name="discount" id="discount" min={0} onChange={this.handleChange}></Input>
                        </FormGroup>
                    </Col>
                </Row>
                <Button>Ekle</Button>
            </Form>
        )
    }

    render() {
        return (
            <div>
                {this.addConsumedPartForm()}
            </div>
        );
    }
};