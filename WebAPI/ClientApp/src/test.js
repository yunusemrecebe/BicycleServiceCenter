import React, { Component, useState } from "react";
import alertify from "alertifyjs";
import { Button, Table, Row, Col, Form, FormGroup, Label, Input } from "reactstrap";
export default class FlavorForm extends React.Component {

        state = {
            products: [],
            productBrands: [],
            productCategories: [],
            productName: "", 
            selectedBrand: NaN,
            selectedCategory: NaN,
            unitPrice: "",
            unitsInStock: "",
        };
    

    handleChangeBrand = (event)  =>{
        this.setState({ selectedBrand: parseInt(event.target.value)  });
    }

    handleChangeCategory = (event) => {
        this.setState({ selectedCategory: parseInt(event.target.value) });
    }

    handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        this.setState({ [name]: value });
    };

    componentDidMount() {
        this.getProducts(9);
        // this.getProductBrands();
        // this.getProductCategories();
    }

    // //Ürün Markalarını Db'den Çekme
    // getProductBrands() {
    //     let token = localStorage.getItem('token');
    //     if (token == null) {
    //         alert('Bu sayfayı görüntüleyebilmek için giriş yapmalısınız!');
    //         this.props.history.push("/login")
    //     }

    //     let url = "/api/productbrands/getall";
    //     fetch(url, {
    //         method: 'get',
    //         headers: {
    //             'Authorization': `Bearer ${token}`
    //         }
    //     })
    //         .then((response) => response.json())
    //         .then((data) => this.setState({ productBrands: data }));
    // };

    // //Ürün Kategorilerini Db'den Çekme
    // getProductCategories() {
    //     let token = localStorage.getItem('token');
    //     if (token == null) {
    //         alert('Bu sayfayı görüntüleyebilmek için giriş yapmalısınız!');
    //         this.props.history.push("/login")
    //     }

    //     let url = "/api/productcategories/getall";
    //     fetch(url, {
    //         method: 'get',
    //         headers: {
    //             'Authorization': `Bearer ${token}`
    //         } 
    //     })
    //         .then((response) => response.json())
    //         .then((data) => this.setState({ productCategories: data }));
    // };

    // //Ürün Ekleme
    // addProduct = (event) => {
    //     event.preventDefault();
        
    //     const requestOptions = {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify({
    //             name: this.state.productName,
    //             brandId: this.state.selectedBrand,
    //             categoryId: this.state.selectedCategory,
    //             unitPrice: this.state.unitPrice,
    //             unitsInStock: this.state.unitsInStock,
    //         }),
    //     };

    //     fetch("/api/products/add", requestOptions)
    //         .then(async (response) => {
    //             const data = await response.json();

    //             if (!response.ok) {
    //                 const error = data;
    //                 return Promise.reject(error);
    //             }

    //             this.getProducts();
    //             Array.from(document.querySelectorAll("input")).forEach((input) => (input.value = ""));

    //             this.setState({  
    //                 productName: "", 
    //                 selectedBrand: NaN,
    //                 selectedCategory: NaN,
    //                 unitPrice: "",
    //                 unitsInStock: "",  });
    //             alertify.success("Ürün Kategorisi Eklendi!");
    //         })

    //         .catch((responseError) => {
    //             if (responseError.Errors) {
    //                 if (responseError.Errors.length > 0) {
    //                     for (let i = 0; i < responseError.Errors.length; i++) {
    //                         alertify.error(responseError.Errors[i].ErrorMessage);
    //                     }
    //                 }
    //                 else {
    //                     alertify.error(responseError);
    //                 }
    //             }
    //             else {
    //                 alertify.error(responseError.message);
    //             }
    //         });
    // };

    // //Ürün Ekleme Formu
    // addProductForm(){
    //     return(
    //         <Form onSubmit={this.addProduct}>
    //             <h1> Ürün Ekle</h1>
    //             <FormGroup>
    //                 <Label for="productName">Ürün Adı</Label>
    //                 <Input type="text" name="productName" id="productName" onChange={this.handleChange} />
    //             </FormGroup>

    //             <FormGroup>
    //                 <Label for="brand">Marka</Label>
    //                 <Input value={this.state.selectedBrand} type="select" name="brand" id="brand" onChange={this.handleChangeBrand}>
    //                     <option selected value={0} >Seçiniz</option>
    //                     {this.state.productBrands.map((productBrand) => (
    //                         <option key={productBrand.productBrandId} value={productBrand.productBrandId}>{productBrand.name}</option>
    //                     ))}
    //                 </Input>
    //             </FormGroup>

    //             <FormGroup>
    //                 <Label for="category">Kategori</Label>
    //                 <Input value={this.state.selectedCategory} type="select" name="category" id="category" onChange={this.handleChangeCategory}>
    //                     <option selected value={0} >Seçiniz</option>
    //                     {this.state.productCategories.map((productCategory) => (
    //                         <option key={productCategory.productCategoryId} value={productCategory.productCategoryId} >{productCategory.name}</option>
    //                     ))}
    //                 </Input>
    //             </FormGroup>

    //             <FormGroup>
    //                 <Label for="unitPrice">Birim Fiyat</Label>
    //                 <Input type="text" name="unitPrice" id="unitPrice" onChange={this.handleChange} />
    //             </FormGroup>

    //             <FormGroup>
    //                 <Label for="unitsInStock">Stoktaki Miktar</Label>
    //                 <Input type="number" name="unitsInStock" id="unitsInStock" onChange={this.handleChange} />
    //             </FormGroup>

    //             <Button>Ekle</Button>
    //         </Form>
    //     )
    // }

    // //Ürün Kategorisi Silme
    // deleteProductCategory(id){

    //     const requestOptions = {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //     };
        
    //     fetch("/api/productcategories/delete?id="+id, requestOptions)
    //         .then(async (response) => {
    //             const data = await response.json();

    //             if (!response.ok) {
    //                 const error = data;
    //                 return Promise.reject(error);
    //             }

    //             this.getProductCategories();
    //             alertify.warning("Ürün Kategorisi Silindi!");
    //         })

    //         .catch((responseError) => {
    //             if (responseError.Errors) {
    //                 if (responseError.Errors.length > 0) {
    //                     for (let i = 0; i < responseError.Errors.length; i++) {
    //                         alertify.error(responseError.Errors[i].ErrorMessage);
    //                     }
    //                 }
    //             }
    //         });  
    // };

    // //Ürün Kategorisi güncellemek için Kategori İd gönderen fonksiyon
    // setProductCategory=(id)=>{
    //     this.props.setProductCategory(id);
    // }

    // //Ürün Kategorisi Güncelleme
    // updateProductCategory(id){
    //     this.setProductCategory(id);
    //     this.props.history.push("/ÜrünKategorisiGüncelle");
    // };
    
    //Ürünleri Db'den Çekme
    getProducts(id) {
        let token = localStorage.getItem('token');
        if (token == null) {
            alert('Bu sayfayı görüntüleyebilmek için giriş yapmalısınız!');
            this.props.history.push("/girisYap")
        }

        let url = "/api/products/getdetailsbyid?id="+id;
        fetch(url, {
            method: 'get',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => response.json())
            .then((data) => this.setState({ products: data }));
    };

    //Db'Den çekilmiş kategorileri listeleme
    ListProducts() {
        return (
            <Table hover>
                <thead>
                    <tr>
                        <th>Ürün Adı</th>
                        <th>Marka</th>
                        <th>Kategori</th>
                        <th>Birim Fiyat</th>
                        <th>Stoktaki Miktar</th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {this.state.products.map((product) => (
                        <tr key={product.productId}>
                            <td>{product.productName}</td>
                            <td>{product.brandName}</td>
                            <td>{product.categoryName}</td>
                            <td>{product.unitPrice}</td>
                            <td>{product.unitsInStock}</td>
                            {/* <td><Button onClick={this.deleteProductCategory.bind(this, product.productId)} color="danger">Sil</Button></td>
                            <td><Button onClick={this.updateProductCategory.bind(this, product.productId)} color="info">Güncelle</Button></td> */}
                        </tr>
                    ))}
                </tbody>
            </Table>
        )
    }

    render() {
        return (
            <div>
                {/* {this.addProductForm()} */}

                <Row>
                <h1 className="text-center">Sistemde Kayıtlı Olan Ürünler</h1>
                </Row>
                <Row>
                    <Col md="8">
                        {this.ListProducts()}
                    </Col>
                    <Col md="4"></Col>
                </Row>

            </div>
        );
    }

}