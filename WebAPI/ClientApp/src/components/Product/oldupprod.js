import React, { Component } from 'react';
import alertify from "alertifyjs";
import { Button, Table, Row, Col, Form, FormGroup, Label, Input } from "reactstrap";

export default class UpdateProductCategory extends Component {

    state = {
        products: [],
        productBrands: [],
        productCategories: [],
        productDetails: [],
        productId: 0,
        selectedBrandId: 0,
        selectedCategoryId: 0,
        selectedBrandName: "",
        selectedCategoryName: "",
        productName: "",
        unitPrice: 0,
        unitsInStock: 0,
    };

    componentDidMount() {
        this.getProductById(this.props.getProduct);
        //this.getProductDetailsById(this.props.getProduct);
        console.log(this.props.getProduct)
        console.log(this.state.productId);
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

    //Ürün Bilgisini Db'den Çekme
    getProductById(id) {
        let token = localStorage.getItem('token');
        if (token == null) {
            alert('Bu sayfayı görüntüleyebilmek için giriş yapmalısınız!');
            this.props.history.push("/login")
        }

        let url = "/api/products/get?id="+id;
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
                    productName: data.name,
                    selectedBrand: data.brandId,
                    selectedCategory: data.categoryId,
                    unitPrice: data.unitPrice,
                    unitsInStock: data.unitsInStock,
                }));
    };
   
    //Ürün Detay Bilgisini Db'den Çekme (ProductDetailDto)
    getProductDetailsById(id) {
        let token = localStorage.getItem('token');
        if (token == null) {
            alert('Bu sayfayı görüntüleyebilmek için giriş yapmalısınız!');
            this.props.history.push("/login")
        }

        let url = "/api/products/getdetailsbyid?id="+id;
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
                    productName: data.name,
                    selectedBrand: data.brandId,
                    selectedCategory: data.categoryId,
                    unitPrice: data.unitPrice,
                    unitsInStock: data.unitsInStock,
                    // productId: data.productId,
                    // selectedBrandId: data.brandId,
                    // selectedCategoryId: data.categoryId,
                    // selectedBrandName: data.brandName,
                    // selectedCategoryName: data.categoryName,
                    // productName: data.productName,
                    // unitPrice: data.unitPrice,
                    // unitsInStock: data.unitsInStock,
                }));
    };

    //Ürün güncelleme
    updateProduct=(event)=>{
        event.preventDefault();
        
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: this.state.name,
                productCategoryId : this.props.getProductCategory,
            }),
        };
        
        fetch("/api/productCategories/update", requestOptions)
            .then(async (response) => {
                const data = await response.json();

                if (!response.ok) {
                    const error = data;
                    return Promise.reject(error);
                }

                alertify.success("Ürün Kategorisi Güncellendi!");
                this.props.history.push("/ÜrünKategorisi");
            })

            .catch((responseError) => {
                if (responseError.Errors) {
                    if (responseError.Errors.length > 0) {
                        for (let i = 0; i < responseError.Errors.length; i++) {
                            alertify.error(responseError.Errors[i].ErrorMessage);
                        }
                    }
                    else{
                        alertify.error(responseError.Message);
                    }
                }
            }); 
    }

    //Ürün güncelleme Form
    updateProductForm() {
        return (
            <Form onSubmit={this.addProduct}>
                <h1> Ürün Ekle</h1>
                <FormGroup>
                    <Label for="productName">Ürün Adı</Label>
                    <Input type="text" name="productName" id="productName" defaultValue={this.state.productName} onChange={this.handleChange} />
                </FormGroup>

                <FormGroup>
                    <Label for="brand">Marka</Label>
                    <Input value={this.state.selectedBrand} type="select" name="brand" id="brand" onChange={this.handleChangeBrand}>
                        <option selected value={this.state.selectedBrand} >{this.state.selectedBrand}</option>
                        {this.state.productBrands.map((productBrand) => (
                            <option key={productBrand.productBrandId} value={productBrand.productBrandId}>{productBrand.name}</option>
                        ))}
                    </Input>
                </FormGroup>

                <FormGroup>
                    <Label for="category">Kategori</Label>
                    <Input value={this.state.selectedCategory} type="select" name="category" id="category" onChange={this.handleChangeCategory}>
                        <option selected value={0} >Seçiniz</option>
                        {this.state.productCategories.map((productCategory) => (
                            <option key={productCategory.productCategoryId} value={productCategory.productCategoryId} >{productCategory.name}</option>
                        ))}
                    </Input>
                </FormGroup>

                <FormGroup>
                    <Label for="unitPrice">Birim Fiyat</Label>
                    <Input type="text" name="unitPrice" id="unitPrice" onChange={this.handleChange} />
                </FormGroup>

                <FormGroup>
                    <Label for="unitsInStock">Stoktaki Miktar</Label>
                    <Input type="number" name="unitsInStock" id="unitsInStock" onChange={this.handleChange} />
                </FormGroup>

                <Button>Ekle</Button>
            </Form>
        )
    }

    render() {
        return (
            <div>
                {this.updateProductForm()}
                <h1>product id {this.state.productId}</h1>
                <h1>product name  {this.state.productName}</h1>
                <h1>marka {this.state.selectedBrandName}</h1>
                <h1>kategori {this.state.selectedCategoryName}</h1>
                <h1>fiyat {this.state.unitPrice}</h1>
                <h1>stok {this.state.unitsInStock}</h1>
                {/* <form onSubmit={this.updateProductCategory}>
                    <FormGroup>
                        <label htmlFor="productCategory">Kategori Adı</label>
                        <input type="text" id="productCategory" name="name" defaultValue={this.state.productCategory.name} onChange={this.handleChange}></input>
                        <button type="submit">Ekle</button>
                    </FormGroup>
                </form> */}
            </div>
        );
    }
};