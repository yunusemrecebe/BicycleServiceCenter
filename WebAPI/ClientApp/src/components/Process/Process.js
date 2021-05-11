import React, { Component, useState } from "react";
import alertify from "alertifyjs";
import { Button, Table, Row, Col, Form, FormGroup, Label, Input } from "reactstrap";

export default class Process extends Component {
    state = {
        processes: [],
    };

    componentDidMount() {
        this.getProcesses();
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

    //Servis Hizmetlerini Db'den çekme
    getProcesses() {
        let token = localStorage.getItem('token');

        let url = "/api/processes/getprocessdetails";
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

                this.setState({ processes: data });

            })
            .catch((responseError) => {
                if (responseError.Message == "Token Bulunamadı!") {
                    this.CreateTokenByRefreshToken();
                }
            })
    };

    //Db'Den çekilmiş servis hizmetlerini listeleme
    ListProcesses() {
        return (
            <Table hover>
                <thead>
                    <tr>
                        <th>Personel</th>
                        <th>Müşteri</th>
                        <th>Bisiklet</th>
                        <th>Başlangıç Tarihi</th>
                        <th>Öngörülen Teslim Tarihi</th>
                        <th>Durum</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {this.state.processes.sort((a, b) => a.startingDate < b.startingDate ? 1:-1).map((process) => (
                        <tr key={process.processId}>
                            <td>{process.employeeName}</td>
                            <td>{process.customerName}</td>
                            <td>{process.bicycle}</td>
                            <td>{process.startingDate.replace('T', ' ').slice(0, -3)}</td>
                            <td>{process.competitionDate}</td>
                            <td>{process.status}</td>
                            <td><Button onClick={this.deleteProcess.bind(this, process.processId)} color="danger">Sil</Button></td>
                            <td><Button onClick={this.updateProcess.bind(this, process.processId, process.customerId)} color="info">Detaylar</Button></td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        )
    }

    //Servis Hizmeti Silme
    deleteProcess(id) {

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        };

        fetch("/api/processes/delete?id=" + id, requestOptions)
            .then(async (response) => {
                const data = await response.json();

                if (!response.ok) {
                    const error = data;
                    return Promise.reject(error);
                }

                this.getProcesses();
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

    //Servis Hizmeti güncellemek için Servis Hizmeti id'si gönderen fonksiyon
    setProcess = (id, customer) => {
        this.props.setProcess(id);
        this.props.setSelectedCustomer(customer);
    }

    //Servis Hizmeti Güncelleme
    updateProcess(id, customer) {
        this.setProcess(id, customer);
        this.props.history.push("/servis/guncelle");
    };

    render() {
        return (
            <div>
                <Row>
                    <h1 className="text-center">Sistemde Kayıtlı Olan Hizmetler</h1>
                </Row>
                <Row>
                    <Col md="12">
                        {this.ListProcesses()}
                    </Col>
                </Row>

            </div>
        );
    }
}
