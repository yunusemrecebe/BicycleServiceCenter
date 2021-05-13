import React, { Component, useState } from "react";
import alertify from "alertifyjs";
import { Button, Label, Input, Table, FormGroup, Row, Col } from "reactstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery.min.js';
import "datatables.net-dt/js/dataTables.dataTables"
import "datatables.net-dt/css/jquery.dataTables.min.css"
import $ from 'jquery';

export default class ProductCategory extends Component {
    state = {
        productCategories: [],
        name: "",
    };

    componentDidUpdate(){
        $(document).ready(function () {
            $('#dataTable').DataTable();
        });
    }

    componentDidMount() {
        this.getProductCategories();
    }

    //form verilerini state içerisine aktaran fonksiyon
    handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        this.setState({ [name]: value });
    };

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

                if (responseError.message == "Refresh Token Bulunamadı!") {
                    alert('Bu işlemi gerçekleştirebilmek için giriş yapmalısınız!');
                    this.props.history.push("/girisYap")
                }
            });
    }

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
                        alertify.error(responseError);
                    }
                }
                else {
                    alertify.error(responseError.message);
                }
            });
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
            .then(async (response) => {
                const data = await response.json();

                if (!response.ok) {
                    const error = data;
                    return Promise.reject(error);
                }

                this.setState({ productCategories: data });

            })
            .catch((responseError) => {
                if (responseError.Message == "Token Bulunamadı!") {
                    this.CreateTokenByRefreshToken();
                }
            })
    };

    //Ürün Kategorisi Silme
    deleteProductCategory(id) {

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        };

        fetch("/api/productcategories/delete?id=" + id, requestOptions)
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
    setProductCategory = (id) => {
        this.props.setProductCategory(id);
    }

    //Ürün Kategorisi Güncelleme
    updateProductCategory(id) {
        this.setProductCategory(id);
        this.props.history.push("/urun/kategori/guncelle");
    };

    //Db'Den çekilmiş kategorileri listeleme
    ListProductCategory() {
        return (
            <Table hover id="dataTable">
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
                <Row>
                    <Col md="3">
                        <form onSubmit={this.addProductCategory}>
                            <h1> Marka Ekle</h1>
                            <FormGroup>
                                <Label for="name">Kategori Adı</Label>
                                <Input type="text" name="name" id="name" onChange={this.handleChange} />
                            </FormGroup>
                            <Button type="submit">Ekle</Button>
                        </form>
                    </Col>
                    <Col md="9"></Col>
                </Row>

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
