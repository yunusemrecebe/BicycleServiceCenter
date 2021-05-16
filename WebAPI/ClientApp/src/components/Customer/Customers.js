import React, { Component } from "react";
import { Button, Table } from "reactstrap";
import alertify from "alertifyjs";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery.min.js';
import "datatables.net-dt/js/dataTables.dataTables"
import "datatables.net-dt/css/jquery.dataTables.min.css"
import $ from 'jquery';

export default class Customers extends Component {
state = {
    customers: []
}

    componentDidUpdate() {
        $(document).ready(function () {
            $('#dataTable').DataTable();
        });
    }

    componentDidMount(){
        this.getCustomers();
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
                    this.props.history.push("/kullanici/giris")
                }
            });
    }

    //Müşterileri Db'den Çekme
    getCustomers() {
        let token = localStorage.getItem('token');

        let url = "/api/customers/getall";
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

                this.setState({ customers: data });

            })
            .catch((responseError) => {
                if (responseError.Message == "Token Bulunamadı!") {
                    this.CreateTokenByRefreshToken();
                }
            })
    };

    //Müşteri Silme
    deleteCustomer = (id) => {
        let token = localStorage.getItem('token');

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            },
        };

        fetch("/api/customers/delete?id=" + id, requestOptions)
            .then(async (response) => {
                const data = await response.json();

                if (!response.ok) {
                    const error = data;
                    alertify.error(data.message);
                    return Promise.reject(error);
                }

                this.getCustomers();

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

    //Db'Den çekilmiş müşterileri listeleme
    ListCustomers() {
        return (
            <Table hover id="dataTable">
                <thead>
                    <tr>
                        <th>Ad Soyad</th>
                        <th>Telefon</th>
                        <th>EMail</th>
                        <th>Adres</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {this.state.customers.length > 0 ? this.state.customers.map((customer) => (
                        <tr key={customer.customerId}>
                            <td>{customer.firstName} {customer.lastName}</td>
                            <td>{customer.phone}</td>
                            <td>{customer.eMail}</td>
                            <td>{customer.adress}</td>
                            <td><Button onClick={this.deleteCustomer.bind(this, customer.customerId)} color="danger">Sil</Button></td>
                            <td><Button onClick={this.updateCustomer.bind(this, customer.customerId)} color="info">Güncelle</Button></td>
                        </tr>
                    ))
                        :
                        <h1>Sistemde kayıtlı müşteri bulunamadı!</h1>
                    }
                </tbody>
            </Table>
        )
    }

    //Müşteri güncellemek için Müşteri İd gönderen fonksiyon
    setCustomer = (id) => {
        this.props.setCustomer(id);
    }

    //Müşteri Güncelleme
    updateCustomer(id) {
        this.setCustomer(id);
        this.props.history.push("/musteri/guncelle");
    };

    render() {
        return (
            <div>
                <center><h1 className="text-center">Sistemde Kayıtlı Olan Müşteriler</h1></center>
                <br></br>
                {this.ListCustomers()}
            </div>
        );
    }
}
