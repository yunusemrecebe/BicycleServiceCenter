import React, { Component } from 'react';
import alertify from "alertifyjs";
import { Button, Table, Row, Col, Form, FormGroup, Label, Input } from "reactstrap";

export default class UpdateProductCategory extends Component {

    state = {
        product: [],
        productBrands: [],
        productCategories: [],
        productDetails: [],
        productId: 0,
        selectedBrandId: 0,
        selectedCategoryId: 0,
        selectedBrandName: "",
        selectedCategoryName: "",
        productName: "",
        unitPrice: 2,
        unitsInStock: 2,
        isLoaded: false,
    };

    componentDidMount() {
        this.getProductDetailsById(this.props.getProduct);
        this.getProductBrands();
        this.getProductCategories();
    }

    handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        this.setState({ [name]: value });
    };

    //Ürün Markalarını Db'den Çekme
    getProductBrands() {
        let token = localStorage.getItem('token');
        if (token == null) {
            alert('Bu sayfayı görüntüleyebilmek için giriş yapmalısınız!');
            this.props.history.push("/login")
        }

        let url = "/api/productbrands/getall";
        fetch(url, {
            method: 'get',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => response.json())
            .then((data) => this.setState({ productBrands: data }));
    };

    //Ürün Kategorilerini Db'den Çekme
    getProductCategories() {
        let token = localStorage.getItem('token');
        if (token == null) {
            alert('Bu sayfayı görüntüleyebilmek için giriş yapmalısınız!');
            this.props.history.push("/login")
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
        console.log(this.state.productId);
    };

    //Ürün Detay Bilgisini Db'den Çekme (ProductDetailDto)
    getProductDetailsById(id) {
        let token = localStorage.getItem('token');
        if (token == null) {
            alert('Bu sayfayı görüntüleyebilmek için giriş yapmalısınız!');
            this.props.history.push("/login")
        }

        let url = "/api/products/getdetailsbyid?id=" + id;
        fetch(url, {
            method: 'get',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => response.json())
            .then((data) => this.setState(
                {
                    productId: data[0].productId,
                    selectedBrandId: data[0].brandId,
                    selectedCategoryId: data[0].categoryId,
                    selectedBrandName: data[0].brandName,
                    selectedCategoryName: data[0].categoryName,
                    productName: data[0].productName,
                    unitPrice: data[0].unitPrice,
                    unitsInStock: data[0].unitsInStock,
                    isLoaded: true,
                }));
    };

    //Ürün güncelleme
    updateProduct = (event) => {
        event.preventDefault();

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                brandId: this.state.selectedBrandId,
                productId: this.state.productId,
                categoryId: this.state.selectedCategoryId,
                name: this.state.productName,
                unitPrice: this.state.unitPrice,
                unitsInStock: this.state.unitsInStock
            }),
        };

        fetch("/api/products/update", requestOptions)
            .then(async (response) => {
                const data = await response.json();
                console.log("124 \n" + data)
                if (!response.ok) {
                    const error = data;
                    return Promise.reject(error);
                }
                
                alertify.success(data.message);
                this.props.history.push("/Ürünler");
            })

            .catch((responseError) => {
                console.log(" 135 \n"+responseError);
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

    //Ürün güncelleme Form
    updateProductForm() {
        return (
            <Form onSubmit={this.updateProduct}>
                <h1> Ürün Ekle</h1>
                <FormGroup>
                    <Label for="productName">Ürün Adı</Label>
                    <Input type="text" name="productName" id="productName" defaultValue={this.state.productName} onChange={this.handleChange} />
                </FormGroup>

                <FormGroup>
                    <Label for="brand">Marka</Label>
                    <Input value={this.state.selectedBrand} type="select" name="selectedBrandId" id="brand" onChange={this.handleChangeBrand}>
                        <option selected value={this.state.selectedBrandId} >{this.state.selectedBrandName}</option>
                        {this.state.productBrands.map((productBrand) => (
                            <option key={productBrand.productBrandId} value={productBrand.productBrandId}>{productBrand.name}</option>
                        ))}
                    </Input>
                </FormGroup>

                <FormGroup>
                    <Label for="category">Kategori</Label>
                    <Input value={this.state.selectedCategory} type="select" name="selectedCategoryId" id="category" onChange={this.handleChangeCategory}>
                        <option selected value={this.state.selectedCategoryId} >{this.state.selectedCategoryName}</option>
                        {this.state.productCategories.map((productCategory) => (
                            <option key={productCategory.productCategoryId} value={productCategory.productCategoryId} >{productCategory.name}</option>
                        ))}
                    </Input>
                </FormGroup>
                {this.state.isLoaded ?
                    <div>
                        <FormGroup>
                            <Label for="unitPrice">Birim Fiyat</Label>
                            <Input type="number" name="unitPrice" id="unitPrice" defaultValue={this.state.unitPrice} onChange={this.handleChange} min="0.00" step="0.001" max="999999999.00" presicion={2}/>
                        </FormGroup>

                        <FormGroup>
                            <Label for="unitsInStock">Stoktaki Miktar</Label>
                            <Input type="number" name="unitsInStock" id="unitsInStock" defaultValue={this.state.unitsInStock} onChange={this.handleChange} min="0"/>
                        </FormGroup>
                    </div>
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
                {this.updateProductForm()}
            </div>
        );
    }
};