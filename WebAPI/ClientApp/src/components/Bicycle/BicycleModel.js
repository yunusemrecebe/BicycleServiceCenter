import React, { Component, useState } from "react";
import alertify from "alertifyjs";
import { Button, Table, Row, Col, Form, FormGroup, Label, Input } from "reactstrap";
import Select from 'react-select';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery.min.js';
import "datatables.net-dt/js/dataTables.dataTables"
import "datatables.net-dt/css/jquery.dataTables.min.css"
import $ from 'jquery';

export default class BicycleModel extends Component {
    state = {
        bicycleModels: [],
    };

    componentDidUpdate(){
        $(document).ready(function () {
            $('#dataTable').DataTable();
        });
    }

    componentDidMount() {
        this.getBicycleModels();
    }

    //Bisiklet Modellerini Db'den Çekme
    getBicycleModels() {
        let token = localStorage.getItem('token');

        let url = "/api/bicyclemodels/getdetails";
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

                this.setState({ bicycleModels: data });

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
                    this.props.history.push("/kullanici/giris")
                }
            });
    }

    //Db'Den çekilmiş model isimlerini listeleme
    ListBicycleModels() {
        return (
            <Table hover id="dataTable">
                <thead>
                    <tr>
                        <th>Bisiklet Modeli İsmi</th>
                        <th>Ait Olduğu Marka</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {this.state.bicycleModels.map((model) => (
                        <tr key={model.bicycleModelId}>
                            <td>{model.bicycleModelName}</td>
                            <td>{model.bicycleBrandName}</td>
                            <td><Button onClick={this.deleteBicycleModel.bind(this, model.bicycleModelId)} color="danger">Sil</Button></td>
                            <td><Button onClick={this.updateBicycleModel.bind(this, model.bicycleModelId)} color="info">Güncelle</Button></td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        )
    }

    //Model İsmi Silme
    deleteBicycleModel(id){

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        };
        
        fetch("/api/bicyclemodels/delete?id="+id, requestOptions)
            .then(async (response) => {
                const data = await response.json();

                if (!response.ok) {
                    const error = data;
                    return Promise.reject(error);
                }

                this.getBicycleModels();
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

    //Model ismi güncellemek için Model İd gönderen fonksiyon
    setBicycleModel=(id)=>{
        this.props.setBicycleModel(id);
    }

    //Model İsmi Güncelleme
    updateBicycleModel(id){
        this.setBicycleModel(id);
        this.props.history.push("/bisiklet/model/guncelle");
    };

    render() {
        return (
            <div>
                <Row>
                <h1 className="text-center">Sistemde Kayıtlı Olan Bisiklet Modelleri</h1>
                </Row>
                <Row>
                    <Col md="12">
                        {this.ListBicycleModels()}
                    </Col>
                </Row>

            </div>
        );
    }
}
