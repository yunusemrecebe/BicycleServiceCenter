import React, { Component, useState } from "react";
import alertify from "alertifyjs";
import { Button, Table, Row, Col, Form, FormGroup, Label, Input } from "reactstrap";
export default class FlavorForm extends React.Component {

        state = {
            products: [],
            productName: "",
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
        this.getProducts(this.props.getProduct);
        // this.getProductBrands();
        // this.getProductCategories();
    }
    
    //Ürünleri Db'den Çekme
    getProducts(id) {
        let token = localStorage.getItem('token');
        if (token == null) {
            alert('Bu sayfayı görüntüleyebilmek için giriş yapmalısınız!');
            this.props.history.push("/girisYap")
        }

        let url = "/api/products/get?id="+id;
        fetch(url, {
            method: 'get',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => response.json())
            .then((data) => this.setState({ productName: data.name }));
    };

  
    //Db'Den çekilmiş kategorileri listeleme
    ListProducts() {
        return (

            <Form onSubmit={this.addProduct}>
                <h1> Ürün Ekle</h1>
                <FormGroup>
                    <Label for="productName">Ürün Adı</Label>
                    <Input type="text" name="productName" id="productName" defaultValue={this.state.productName} onChange={this.handleChange} />
                </FormGroup>

                {/* <FormGroup>
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
                </FormGroup> */}

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
            
            // <Table hover>
            //     <thead>
            //         <tr>
            //             <th></th>
            //             <th></th>
            //             <th></th>
            //             <th></th>
            //             <th></th>
            //             <th></th>
            //             <th></th>
            //             <th></th>
            //         </tr>
            //     </thead>

            //     <tbody>
            //         {this.state.products.map((product) => (
            //             <tr key={product.productId}>
            //                 <td>{product.productId}</td>
            //                 <td>{product.brandId}</td>
            //                 <td>{product.categoryId}</td>
            //                 <td>{product.productName}</td>
            //                 <td>{product.brandName}</td>
            //                 <td>{product.categoryName}</td>
            //                 <td>{product.unitPrice}</td>
            //                 <td>{product.unitsInStock}</td>
            //                 {/* <td><Button onClick={this.deleteProductCategory.bind(this, product.productId)} color="danger">Sil</Button></td>
            //                 <td><Button onClick={this.updateProductCategory.bind(this, product.productId)} color="info">Güncelle</Button></td> */}
            //             </tr>
            //         ))}
            //     </tbody>
            // </Table>
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