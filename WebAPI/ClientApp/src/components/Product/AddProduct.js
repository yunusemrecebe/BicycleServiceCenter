import React, { Component } from "react";
import alertify from "alertifyjs";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import Select from 'react-select';
import '../../css/style.css';

export default class AddProduct extends Component {
    state = {
        productBrands: [],
        productCategories: [],
        productCode: "",
        productName: "",
        selectedBrand: 0,
        selectedCategory: 0,
    };

    handleChangeBrand = (event) => {
        this.state.selectedBrand = event.value;
    }

    handleChangeCategory = (event) => {
        this.state.selectedCategory = event.value;
    }

    handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        this.setState({ [name]: value });
    };

    componentDidMount() {
        this.getProductBrands();
        this.getProductCategories();
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

    //Ürün Markalarını Db'den Çekme
    getProductBrands() {
        let token = localStorage.getItem('token');

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

    //Ürün Ekleme
    addProduct = (event) => {
        event.preventDefault();

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                productCode: this.state.productCode,
                name: this.state.productName,
                brandId: this.state.selectedBrand,
                categoryId: this.state.selectedCategory
            }),
        };

        fetch("/api/products/add", requestOptions)
            .then(async (response) => {
                const data = await response.json();

                if (!response.ok) {
                    const error = data;
                    return Promise.reject(error);
                }

                Array.from(document.querySelectorAll("input")).forEach((input) => (input.value = ""));

                this.setState({
                    productCode: "",
                    productName: "",
                    selectedBrand: 0,
                    selectedCategory: 0,
                });

                alertify.success(data.message);
                this.props.history.push("/urun/listele")
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

    //Ürün Ekleme Formu
    addProductForm() {
        return (
            <Form onSubmit={this.addProduct}>
                <h1> Ürün Ekle</h1>
                <FormGroup>
                    <Label for="productCode">*Ürün Kodu</Label>
                    <Input type="text" name="productCode" id="productCode" onChange={this.handleChange} />
                </FormGroup>

                <FormGroup>
                    <Label for="productName">*Ürün Adı</Label>
                    <Input type="text" name="productName" id="productName" onChange={this.handleChange} />
                </FormGroup>

                <FormGroup>
                    {this.ProductBrandSelect(this.state.productBrands)}
                </FormGroup>

                <FormGroup>
                    {this.ProductCategorySelect(this.state.productCategories)}
                </FormGroup>

                <Button>Ekle</Button>
                <h6 className="RequiredField">Not: * ile işaretlenen alanların doldurulması zorunludur</h6>
            </Form>
        )
    }

    ProductBrandSelect(dizi = []) {
        let options = [];
        if (dizi.length != options.length) {
            for (let index = 0; index < dizi.length; index++) {
                options.push({ value: dizi[index].productBrandId, label: dizi[index].name },)
            };
        }

        return <div>
            <Label for="brand">*Ürün Markası</Label>
            <Select
                id="brand"
                placeholder="Seçiniz"
                options={options}
                onChange={this.handleChangeBrand}
            />
        </div>
    }

    ProductCategorySelect(dizi = []) {
        let options = [];
        if (dizi.length != options.length) {
            for (let index = 0; index < dizi.length; index++) {
                options.push({ value: dizi[index].productCategoryId, label: dizi[index].name },)
            };
        }

        return <div>
            <Label for="category">*Ürün Kategorisi</Label>
            <Select
                id="category"
                placeholder="Seçiniz"
                options={options}
                onChange={this.handleChangeCategory}
            />
        </div>
    }

    render() {
        return (
            <div>
                {this.addProductForm()}
            </div>
        );
    }

}