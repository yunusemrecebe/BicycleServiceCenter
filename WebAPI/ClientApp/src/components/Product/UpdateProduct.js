import React, { Component } from 'react';
import alertify from "alertifyjs";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";

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
        productCode: "",
        productName: "",
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

    handleChangeBrand = (event) => {
        this.setState({ selectedBrandId: parseInt(event.target.value) });
    }

    handleChangeCategory = (event) => {
        this.setState({ selectedCategoryId: parseInt(event.target.value) });
    }

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
                    productId: data.productId,
                    selectedBrandId: data.brandId,
                    selectedCategoryId: data.categoryId,
                    selectedBrandName: data.brandName,
                    selectedCategoryName: data.categoryName,
                    productName: data.productName,
                    productCode: data.productCode,
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
                productCode: this.state.productCode,
                name: this.state.productName,
            }),
        };

        fetch("/api/products/update", requestOptions)
            .then(async (response) => {
                const data = await response.json();

                if (!response.ok) {
                    const error = data;
                    return Promise.reject(error);
                }
                
                alertify.success(data.message);
                this.props.history.push("/Ürünler");
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

    //Ürün güncelleme Form
    updateProductForm() {
        return (
            <Form onSubmit={this.updateProduct}>
                <h1> Ürün Güncelle</h1>
                <FormGroup>
                    <Label for="productCode">Ürün Kodu</Label>
                    <Input type="text" name="productCode" id="productCode" defaultValue={this.state.productCode} onChange={this.handleChange} />
                </FormGroup>

                <FormGroup>
                    <Label for="productName">Ürün Adı</Label>
                    <Input type="text" name="productName" id="productName" defaultValue={this.state.productName} onChange={this.handleChange} />
                </FormGroup>

                <FormGroup>
                    <Label for="brand">Marka</Label>
                    <Input value={this.state.selectedBrandId} type="select" name="selectedBrandId" id="brand" onChange={this.handleChangeBrand}>
                        {this.state.productBrands.map((productBrand) => (
                            <option key={productBrand.productBrandId} value={productBrand.productBrandId}>{productBrand.name}</option>
                        ))}
                    </Input>
                </FormGroup>

                <FormGroup>
                    <Label for="category">Kategori</Label>
                    <Input value={this.state.selectedCategoryId} type="select" name="selectedCategoryId" id="category" onChange={this.handleChangeCategory}>
                        {this.state.productCategories.map((productCategory) => (
                            <option key={productCategory.productCategoryId} value={productCategory.productCategoryId} >{productCategory.name}</option>
                        ))}
                    </Input>
                </FormGroup>

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