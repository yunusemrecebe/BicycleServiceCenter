import React, { Component } from "react";
import alertify from "alertifyjs";
import { Button, Table, Row, Col } from "reactstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery.min.js';
import "datatables.net-dt/js/dataTables.dataTables"
import "datatables.net-dt/css/jquery.dataTables.min.css"
import $ from 'jquery';

export default class Employees extends Component {
    state = {
        employees: [],
    };

    componentDidUpdate(){
        $(document).ready(function () {
            $('#dataTable').DataTable();
        });
    }

    componentDidMount() {
        this.getEmployees();
    }

    //Personelleri Db'den Çekme
    getEmployees() {
        let token = localStorage.getItem('token');

        let url = "/api/employees/getall";
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

                this.setState({ employees: data });

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

                if (!response.ok) {
                    const error = data;
                    return Promise.reject(error);
                }

                localStorage.setItem('token', data.data.accessToken);
                localStorage.setItem('refreshToken', data.data.refreshToken);

                this.getEmployees();
            })

            .catch((responseError) => {

                if (responseError.message == "Refresh Token Bulunamadı!") {
                    alert('Bu işlemi gerçekleştirebilmek için giriş yapmalısınız!');
                    this.props.history.push("/kullanici/giris")
                }
            });
    }

    //Db'Den çekilmiş personelleri listeleme
    ListEmployees() {
        return (
            <Table hover id="dataTable">
                <thead>
                    <tr>
                        <th>Ad Soyad</th>
                        <th>Telefon</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {this.state.employees.length > 0 ? this.state.employees.map((employee) => (
                        <tr key={employee.employeeId}>
                            <td>{employee.firstName} {employee.lastName}</td>
                            <td>{employee.phone}</td>
                            <td><Button onClick={this.deleteEmployee.bind(this, employee.employeeId)} color="danger">Sil</Button></td>
                            <td><Button onClick={this.updateEmployee.bind(this, employee.employeeId)} color="info">Güncelle</Button></td>
                        </tr>
                    ))
                        :
                        null
                    }
                </tbody>
            </Table>
        )
    }

    //Personel Silme
    deleteEmployee(id) {

        let token = localStorage.getItem('token');
        if (token == null) {
            alert('Bu işlemi gerçekleştirebilmek için giriş yapmalısınız!');
            this.props.history.push("/girisYap")
        }

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            },
        };

        fetch("/api/employees/delete?id=" + id, requestOptions)
            .then(async (response) => {
                const data = await response.json();

                if (!response.ok) {
                    const error = data;
                    alertify.error(data.message);
                    return Promise.reject(error);
                }

                this.getEmployees();
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

    //Personel güncellemek için Personel İd gönderen fonksiyon
    setEmployee = (id) => {
        this.props.setEmployee(id);
    }

    //Personel Güncelleme
    updateEmployee(id) {
        this.setEmployee(id);
        this.props.history.push("/personel/guncelle");
    };

    render() {
        return (
            <div>
                <Row>
                    <h1 className="text-center">Sistemde Kayıtlı Olan Personeller</h1>
                </Row>
                <Row>
                    <Col md="12">
                        {this.ListEmployees()}
                    </Col>
                </Row>

            </div>
        );
    }
}
