import React, { Component, useState } from "react";
import alertify from "alertifyjs";
import { Button, Table, Row, Col, Form, FormGroup, Label, Input } from "reactstrap";
import Select from 'react-select';

export default class Process extends Component {
    state = {
        processes: [],
        bicycles: [],
        customers: [],
        customerOptions: [],
        employees: [],
        selectedEmployee: 0,
        selectedBicycle: 0,
        selectedCustomer: 0,
        completionDate: "1 Gün",
        diagnostics: "",
        isLoaded: false,
    };

    componentDidMount() {
        this.getProcesses();
        this.getEmployees();
        this.getCustomers();
    }

    handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        this.setState({ [name]: value });
    };

    handleChangeBicycle = (event) => {
        this.state.selectedBicycle = event.value;
    }

    handleChangeEmployee = (event) => {
        this.state.selectedEmployee = event.value;
    }

    handleChangeCustomer = (event) => {
        this.state.selectedCustomer = event.value;
        this.getBicycles(this.state.selectedCustomer);
    }

    handleChangeCompletionDate = (event) => {
        this.state.completionDate = event.value;
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

    //Müşteriye Göre Bisikletleri Db'den Çekme
    getBicycles(id) {
        let token = localStorage.getItem('token');

        let url = "/api/bicycles/getdetailsbycustomer?id=" + id;
        fetch(url, {
            method: 'get',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => response.json())
            .then((data) => this.setState({ bicycles: data }));
    };

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
            .then((response) => response.json())
            .then((data) => this.setState({ customers: data }));
    };

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
            .then((response) => response.json())
            .then((data) => this.setState({ employees: data }));
    };

    // Servis Hizmeti Ekleme
    addProcess = (event) => {
        event.preventDefault();

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                employeeId: this.state.selectedEmployee,
                customerId: this.state.selectedCustomer,
                bicycleId: this.state.selectedBicycle,
                completionDate: this.state.completionDate,
                diagnostics: this.state.diagnostics,
            }),
        };

        fetch("/api/processes/add", requestOptions)
            .then(async (response) => {
                const data = await response.json();

                if (!response.ok) {
                    const error = data;
                    return Promise.reject(error);
                }

                this.getProcesses();

                Array.from(document.querySelectorAll("input")).forEach((input) => (input.value = ""));
                this.setState({
                    selectedEmployee: 0,
                    selectedCustomer: 0,
                    selectedBicycle: 0,
                    completionDate: "1 Gün",
                    diagnostics: "",
                });

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

    // Servis Hizmeti Ekleme Formu
    addProcessForm() {
        return (
            <Form onSubmit={this.addProcess}>
                <h1> Servis Hizmeti Ekle</h1>
                <Row>
                    <Col md={4}>
                        <FormGroup>

                            {this.CustomerSelect(this.state.customers)}
                        </FormGroup>
                    </Col>

                    <Col md={4}>
                        <FormGroup>
                            {this.BicycleSelect(this.state.bicycles)}
                        </FormGroup>
                    </Col>

                    <Col md={4}>
                        <FormGroup>
                            {this.EmployeeSelect(this.state.employees)}
                        </FormGroup>
                    </Col>
                </Row>

                <Row>
                    <Col md={4}>
                        <FormGroup>
                            {this.CompletionDateSelect()}
                        </FormGroup>
                    </Col>

                    <Col md={8}>
                        <FormGroup>
                            <Label for="diagnostics">Teşhisler</Label>
                            <Input type="text" name="diagnostics" id="diagnostics" onChange={this.handleChange}></Input>
                        </FormGroup>
                    </Col>
                </Row>

                <Button>Ekle</Button>
            </Form>
        )
    }

    CustomerSelect(dizi = []) {

        if (dizi.length != this.state.customerOptions.length) {
            for (let index = 0; index < dizi.length; index++) {
                this.state.customerOptions.push({ value: dizi[index].customerId, label: dizi[index].firstName + " " + dizi[index].lastName },)
            };
        }

        return <div>
            <Label for="customerSelect">Müşteri</Label>
            <Select
                id="customerSelect"
                placeholder="Seçiniz"
                options={this.state.customerOptions}
                onChange={this.handleChangeCustomer}
            />
        </div>

    }

    BicycleSelect(dizi = []) {
        let options = [];
        if (dizi.length != options.length) {
            for (let index = 0; index < dizi.length; index++) {
                options.push({ value: dizi[index].bicycleId, label: dizi[index].brandName + " " + dizi[index].modelName },)
            };
        }

        return <div>
            <Label for="bicycleSelect">Bisiklet</Label>
            <Select
                id="bicycleSelect"
                placeholder="Seçiniz"
                options={options}
                onChange={this.handleChangeBicycle}
            />
        </div>
    }

    EmployeeSelect(dizi = []) {
        let options = [];
        if (dizi.length != options.length) {
            for (let index = 0; index < dizi.length; index++) {
                options.push({ value: dizi[index].employeeId, label: dizi[index].firstName + " " + dizi[index].lastName },)
            };
        }

        return <div>
            <Label for="employeeSelect">Personel</Label>
            <Select
                id="employeeSelect"
                placeholder="Seçiniz"
                options={options}
                onChange={this.handleChangeEmployee}
            />
        </div>
    }

    CompletionDateSelect() {
        let options = [
            { value: "1 Gün", label: "1 Gün" },
            { value: "1-3 Gün", label: "1-3 Gün" },
            { value: "3-5 Gün", label: "3-5 Gün" },
            { value: "1 Hafta", label: "1 Hafta" },
            { value: "10 Gün", label: "10 Gün" },
            { value: "20 Gün", label: "20 Gün" },
        ];

        return <div>
            <Label for="completionDate">Öngörülen Teslim Tarihi</Label>
            <Select
                id="completionDate"
                placeholder="Seçiniz"
                options={options}
                onChange={this.handleChangeCompletionDate}
            />
        </div>
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
                    {this.state.processes.map((process) => (
                        <tr key={process.processId}>
                            <td>{process.employeeName}</td>
                            <td>{process.customerName}</td>
                            <td>{process.bicycle}</td>
                            <td>{process.startingDate.replace('T', ' ')}</td>
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
        this.props.history.push("/servisHizmetiGüncelle");
    };

    render() {
        return (
            <div>
                {this.addProcessForm()}
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
