import React, { Component, useState } from "react";
import alertify from "alertifyjs";
import { Button, Table } from "reactstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery.min.js';
import "datatables.net-dt/js/dataTables.dataTables"
import "datatables.net-dt/css/jquery.dataTables.min.css"
import $ from 'jquery';

export default class Bicycle extends Component {
    state = {
        bicycles: [],
        bicycleBrands: [],
        bicycleModels: [],
        customers: [],
        selectedBrand: 0,
        selectedModel: 0,
        selectedCustomer: 0,
        productionDate: 0,
        serialNumber: "",
    };

    componentDidUpdate() {
        $(document).ready(function () {
            $('#dataTable').DataTable();
        });
    }

    componentDidMount() {
        this.getBicycles();
    }

    //Bisikletleri Db'den Çekme
    getBicycles() {
        let token = localStorage.getItem('token');

        let url = "/api/bicycles/getdetails";
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

                this.setState({ bicycles: data });

            })
            .catch((responseError) => {
                if (responseError.Message == "Token Bulunamadı!") {
                    this.CreateTokenByRefreshToken();
                }
            })
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

    //Db'Den çekilmiş biikletleri listeleme
    ListBicycles() {
        return (
            <Table hover id="dataTable">
                <thead>
                    <tr>
                        <th>Markası İsmi</th>
                        <th>Model İsmi</th>
                        <th>Üretim Yılı</th>
                        <th>Sahibi</th>
                        <th>Şase Numarası</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {this.state.bicycles.map((bicycle) => (
                        <tr key={bicycle.bicycleId}>
                            <td>{bicycle.brandName}</td>
                            <td>{bicycle.modelName}</td>
                            <td>{bicycle.productionDate}</td>
                            <td>{bicycle.ownerName}</td>
                            <td>{bicycle.serialNumber}</td>
                            <td><Button onClick={this.deleteBicycle.bind(this, bicycle.bicycleId)} color="danger">Sil</Button></td>
                            <td><Button onClick={this.updateBicycle.bind(this, bicycle.bicycleId)} color="info">Güncelle</Button></td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        )
    }

    //Bisiklet Silme
    deleteBicycle(id) {

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        };

        fetch("/api/bicycles/delete?id=" + id, requestOptions)
            .then(async (response) => {
                const data = await response.json();

                if (!response.ok) {
                    const error = data;
                    return Promise.reject(error);
                }

                this.getBicycles();
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

    //Bisiklet güncellemek için Bisiklet İd gönderen fonksiyon
    setBicycle = (id) => {
        this.props.setBicycle(id);
    }

    //Bisiklet Güncelleme
    updateBicycle(id) {
        this.setBicycle(id);
        this.props.history.push("/bisiklet/guncelle");
    };

    render() {
        return (
            <div>
                <center><h1 className="text-center">Sistemde Kayıtlı Olan Bisikletler</h1></center>
                {this.ListBicycles()}
            </div>
        );
    }
}
