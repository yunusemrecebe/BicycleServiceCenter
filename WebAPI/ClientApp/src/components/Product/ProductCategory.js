import React, { Component, useState } from "react";
import alertify from "alertifyjs";
import {Button, Table, FormGroup, Row, Col} from "reactstrap";

export default class ProductCategory extends Component {
    state = {
        productCategories: [],
        name: "",
    };

    componentDidMount() {
        this.getProductCategories();
    }

    //form verilerini state içerisine aktaran fonksiyon
    handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        this.setState({ [name]: value });
    };

    // Ürün Kategorisi Ekleme
    addProductCategory = (event) => {
        event.preventDefault();

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: this.state.name,
            }),
        };
        
        fetch("/api/productcategories/add", requestOptions)
            .then(async (response) => {
                const data = await response.json();

                if (!response.ok) {
                    const error = data;
                    return Promise.reject(error);
                }

                this.getProductCategories();
                Array.from(document.querySelectorAll("input")).forEach((input) => (input.value = ""));
                this.setState({ name: "" });
                alertify.success("Ürün Kategorisi Eklendi!");
            })

            .catch((responseError) => {
                if (responseError.Errors) {
                    if (responseError.Errors.length > 0) {
                        for (let i = 0; i < responseError.Errors.length; i++) {
                            alertify.error(responseError.Errors[i].ErrorMessage);
                        }
                    }
                    else{
                        alertify.error(responseError);
                    }
                }
                else{
                    alertify.error(responseError.message);
                }
            });
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
    };

    //Ürün Kategorisi Silme
    deleteProductCategory(id){

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        };
        
        fetch("/api/productcategories/delete?id="+id, requestOptions)
            .then(async (response) => {
                const data = await response.json();

                if (!response.ok) {
                    const error = data;
                    return Promise.reject(error);
                }

                this.getProductCategories();
                alertify.warning("Ürün Kategorisi Silindi!");
            })

            .catch((responseError) => {
                if (responseError.Errors) {
                    if (responseError.Errors.length > 0) {
                        for (let i = 0; i < responseError.Errors.length; i++) {
                            alertify.error(responseError.Errors[i].ErrorMessage);
                        }
                    }
                }
            });  
    };

    //Ürün Kategorisi güncellemek için Kategori İd gönderen fonksiyon
    setProductCategory=(id)=>{
        this.props.setProductCategory(id);
    }

    //Ürün Kategorisi Güncelleme
    updateProductCategory(id){
        this.setProductCategory(id);
        this.props.history.push("/ÜrünKategorisiGüncelle");
    };

    //Db'Den çekilmiş kategorileri listeleme
    ListProductCategory() {
        return (
            <Table hover>
                <thead>
                    <tr>
                        <th>Ürün Kategorileri</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {this.state.productCategories.map((category) => (
                        <tr key={category.productCategoryId}>
                            <td>{category.name}</td>
                            <td><Button onClick={this.deleteProductCategory.bind(this, category.productCategoryId)} color="danger">Sil</Button></td>
                            <td><Button onClick={this.updateProductCategory.bind(this, category.productCategoryId)} color="info">Güncelle</Button></td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        )
    }

    render() {
        return (
            <div>
                <form onSubmit={this.addProductCategory}>
                    <FormGroup>
                        <label htmlFor="categoryName">Kategori Adı</label>
                        <input type="text" id="categoryName" name="name" onChange={this.handleChange}></input>
                        <button type="submit">Ekle</button>
                    </FormGroup>
                </form>

                <Row>
                <h1 className="text-center">Sistemde Kayıtlı Olan Ürün Kategorileri</h1>
                </Row>
                <Row>
                    <Col md="12">
                        {this.ListProductCategory()}
                    </Col>
                </Row>

            </div>
        );
    }
}
