import React, { Component, useState } from "react";
import alertify from "alertifyjs";
import { Button, Table, Row, Col, Form, FormGroup, Label, Input } from "reactstrap";
import Select from 'react-select';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery.min.js';
import "datatables.net-dt/js/dataTables.dataTables"
import "datatables.net-dt/css/jquery.dataTables.min.css"
import $ from 'jquery';

export default class Product extends Component {
    state = {
        products: [],
    };

    componentDidUpdate(){
        $(document).ready(function () {
            $('#dataTable').DataTable();
        });
    }

    componentDidMount() {
        this.getProducts();
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

    //Ürün Silme
    deleteProduct(id) {

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        };

        fetch("/api/products/delete?id=" + id, requestOptions)
            .then(async (response) => {
                const data = await response.json();

                if (!response.ok) {
                    alertify.error(data.message);
                    const error = data;
                    return Promise.reject(error);
                }

                this.getProducts();
                alertify.warning(data.message);
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
    setProduct = (id) => {
        this.props.setProduct(id);
    }

    //Ürün Kategorisi Güncelleme
    updateProduct(id) {
        this.setProduct(id);
        this.props.history.push("/urun/guncelle");
    };

    //Ürünleri Db'den Çekme
    getProducts() {
        let token = localStorage.getItem('token');

        let url = "/api/products/getdetails";
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

            this.setState({ products: data });

        })
        .catch((responseError) => {
            if (responseError.Message == "Token Bulunamadı!") {
                this.CreateTokenByRefreshToken();
            }
        })
    };

    //Db'Den çekilmiş kategorileri listeleme
    ListProducts() {
        return (
            <Table hover id="dataTable">
                <thead>
                    <tr>
                        <th>Ürün Kodu</th>
                        <th>Ürün Adı</th>
                        <th>Marka</th>
                        <th>Kategori</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {this.state.products.map((product) => (
                        <tr key={product.productId}>
                            <td>{product.productCode}</td>
                            <td>{product.productName}</td>
                            <td>{product.brandName}</td>
                            <td>{product.categoryName}</td>
                            <td><Button onClick={this.deleteProduct.bind(this, product.productId)} color="danger">Sil</Button></td>
                            <td><Button onClick={this.updateProduct.bind(this, product.productId)} color="info">Güncelle</Button></td>
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
                    <h1 className="text-center">Sistemde Kayıtlı Olan Ürünler</h1>
                </Row>
                <Row>
                    <Col md="12">
                        {this.ListProducts()}
                    </Col>
                </Row>

            </div>
        );
    }

}