import React, { Component, useState } from "react";
import alertify from "alertifyjs";
import { Button, Table, Row, Col } from "reactstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery.min.js';
import "datatables.net-dt/js/dataTables.dataTables"
import "datatables.net-dt/css/jquery.dataTables.min.css"
import $ from 'jquery';

export default class Inventory extends Component {
    state = {
        inventory: [],
    };

    componentDidUpdate(){
        $(document).ready(function () {
            $('#dataTable').DataTable();
        });
    }

    componentDidMount() {
        this.getInventory();
    }

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
                    this.props.history.push("/kullanici/giris")
                }
            });
    }

    //Envanteri Db'den çekme
    getInventory() {
        let token = localStorage.getItem('token');
        if (token == null) {
            alert('Bu sayfayı görüntüleyebilmek için giriş yapmalısınız!');
            this.props.history.push("/girisYap")
        }

        let url = "/api/inventory/getdetails";
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

                this.setState({ inventory: data });

            })
            .catch((responseError) => {
                if (responseError.Message == "Token Bulunamadı!") {
                    this.CreateTokenByRefreshToken();
                }
            })
    };

    //Db'Den çekilmiş Envanter listeleme
    ListInventory() {
        return (
            <Table hover id="dataTable">
                <thead>
                    <tr>
                        <th>Ürün Kodu</th>
                        <th>Ürün</th>
                        <th>Alış Fiyatı</th>
                        <th>Satış Fiyatı</th>
                        <th>Stoktaki Birim Miktarı</th>
                        <th>Satış Durumu</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {this.state.inventory.map((inventory) => (
                        <tr key={inventory.inventoryId}>
                            <td>{inventory.productCode}</td>
                            <td>{inventory.product}</td>
                            <td>{inventory.purchasePrice}</td>
                            <td>{inventory.sellPrice}</td>
                            <td>{inventory.unitsInStock}</td>
                            <td>{inventory.status}</td>
                            <td><Button onClick={this.deleteStock.bind(this, inventory.inventoryId)} color="danger">Sil</Button></td>
                            <td><Button onClick={this.updateStock.bind(this, inventory.inventoryId)} color="info">Güncelle</Button></td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        )
    }

    //Envanterden stok silme
    deleteStock(id) {

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        };

        fetch("/api/inventory/delete?id=" + id, requestOptions)
            .then(async (response) => {
                const data = await response.json();

                if (!response.ok) {
                    const error = data;
                    return Promise.reject(error);
                }

                this.getInventory();
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

    //Envanter güncellemek için Envanter id'si gönderen fonksiyon
    setInventory = (id) => {
        this.props.setInventory(id);
    }

    //Envanter Güncelleme
    updateStock(id) {
        this.setInventory(id);
        this.props.history.push("/stok/guncelle");
    };

    render() {
        return (
            <div>
                <Row>
                    <h1 className="text-center">Envanter</h1>
                </Row>
                <Row>
                    <Col md="12">
                        {this.ListInventory()}
                    </Col>
                </Row>

            </div>
        );
    }
}
