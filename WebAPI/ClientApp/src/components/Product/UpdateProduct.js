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
        isProductLoaded: false,
    };

    componentDidMount() {
        this.getProductBrands();
        this.getProductCategories();
        this.getProductDetailsById(this.props.getProduct);
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

    //??r??n Markalar??n?? Db'den ??ekme
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

    //??r??n Kategorilerini Db'den ??ekme
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

    //??r??n Detay Bilgisini Db'den ??ekme (ProductDetailDto)
    getProductDetailsById(id) {
        let token = localStorage.getItem('token');

        let url = "/api/products/getdetailsbyid?id=" + id;
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
                    productId: data.productId,
                    selectedBrandId: data.brandId,
                    selectedCategoryId: data.categoryId,
                    selectedBrandName: data.brandName,
                    selectedCategoryName: data.categoryName,
                    productName: data.productName,
                    productCode: data.productCode,
                    isProductLoaded: true,
                });
            })
            .catch((responseError) => {
                if (responseError.Message == "Token Bulunamad??!") {
                    this.CreateTokenByRefreshToken();
                }
            })
    };

    //??r??n g??ncelleme
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
                this.props.history.push("/urun/listele");
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

    //??r??n g??ncelleme Form
    updateProductForm() {
        return (
            <Form onSubmit={this.updateProduct}>
                <h1> ??r??n G??ncelle</h1>
                <FormGroup>
                    <Label for="productCode">??r??n Kodu</Label>
                    <Input type="text" name="productCode" id="productCode" defaultValue={this.state.productCode} onChange={this.handleChange} />
                </FormGroup>

                <FormGroup>
                    <Label for="productName">??r??n Ad??</Label>
                    <Input type="text" name="productName" id="productName" defaultValue={this.state.productName} onChange={this.handleChange} />
                </FormGroup>

                <FormGroup>
                    <Label for="brand">Marka</Label>
                    {this.state.isProductLoaded == true ?
                        <Input value={this.state.selectedBrandId} type="select" name="selectedBrandId" id="brand" onChange={this.handleChangeBrand}>
                            {this.state.selectedBrandId != 0 ? this.state.productBrands.map((productBrand) => (
                                <option key={productBrand.productBrandId} value={productBrand.productBrandId}>{productBrand.name}</option>
                            ))
                                :
                                <option>Se??iniz</option>
                            }
                        </Input>
                        :
                        null
                    }
                </FormGroup>

                <FormGroup>
                    <Label for="category">Kategori</Label>
                    {this.state.isProductLoaded == true ?
                        <Input value={this.state.selectedCategoryId} type="select" name="selectedCategoryId" id="category" onChange={this.handleChangeCategory}>
                            {this.state.productCategories != 0 ? this.state.productCategories.map((productCategory) => (
                                <option key={productCategory.productCategoryId} value={productCategory.productCategoryId} >{productCategory.name}</option>
                            ))
                                :
                                <option>Se??iniz</option>
                            }
                        </Input>
                        :
                        null
                    }
                </FormGroup>

                <Button>G??ncelle</Button>
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