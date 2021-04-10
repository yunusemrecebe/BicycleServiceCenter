import React, { Component, useState } from "react";
import alertify from "alertifyjs";
import { Button, Table, Row, Col, Form, FormGroup, Label, Input } from "reactstrap";

export default class Process extends Component {
    state = {
        processes: [],
        bicycles: [],
        customers: [],
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
        this.setState({ selectedBicycle: parseInt(event.target.value) });
    }

    handleChangeEmployee = (event) => {
        this.setState({ selectedEmployee: parseInt(event.target.value) });
    }

    handleChangeCustomer = (event) => {
        this.setState({ isLoaded: true });
        this.state.selectedCustomer = document.getElementById("owner").value;
        this.getBicycles(this.state.selectedCustomer);
    }

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
                            <Label for="owner">Müşteri</Label>
                            <Input value={this.state.selectedCustomer} type="select" name="owner" id="owner" onChange={this.handleChangeCustomer}>
                                <option selected value={0} >Seçiniz</option>
                                {this.state.customers.map((customer) => (
                                    <option key={customer.customerId} value={customer.customerId} >{customer.firstName} {customer.lastName}</option>
                                ))}
                            </Input>
                        </FormGroup>
                    </Col>

                    <Col md={4}>
                        <FormGroup>
                            <Label for="bicycle">Bisiklet</Label>
                            <Input type="select" name="bicycle" id="bicycle" onChange={this.handleChangeBicycle}>
                                <option selected value={0} >Seçiniz</option>
                                {this.state.bicycles.map((bicycle) => (
                                    <option key={bicycle.bicycleId} value={bicycle.bicycleId}>{bicycle.brandName} {bicycle.modelName}</option>
                                ))}
                            </Input>
                        </FormGroup>
                    </Col>

                    <Col md={4}>
                    <FormGroup>
                            <Label for="employee">Personel</Label>
                            <Input type="select" name="employee" id="employee" onChange={this.handleChangeEmployee}>
                                <option selected value={0} >Seçiniz</option>
                                {this.state.employees.map((employee) => (
                                    <option key={employee.employeeId} value={employee.employeeId}>{employee.firstName} {employee.lastName}</option>
                                ))}
                            </Input>
                        </FormGroup>
                    </Col>
                </Row>
                                        
                <Row>
                   <Col md={4}>
                   <FormGroup>
                    <Label for="completionDate">Öngörülen Teslim Tarihi</Label>
                    <Input type="select" name="completionDate" id="completionDate" onChange={this.handleChange}>
                        <option selected value="1 Gün" >1 Gün</option>
                        <option value="1-3 Gün" >1-3 Gün</option>
                        <option value="3-5 Gün" >3-5 Gün</option>
                        <option value="1 Hafta" >1 Hafta</option>
                        <option value="10 Gün" >10 Gün</option>
                        <option value="20 Gün" >20 Gün</option>
                    </Input>
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

    //Müşteriye Göre Bisikletleri Db'den Çekme
    getBicycles(id) {
        let token = localStorage.getItem('token');
        if (token == null) {
            alert('Bu sayfayı görüntüleyebilmek için giriş yapmalısınız!');
            this.props.history.push("/girisYap")
        }

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
        if (token == null) {
            alert('Bu sayfayı görüntüleyebilmek için giriş yapmalısınız!');
            this.props.history.push("/girisYap")
        }

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
        if (token == null) {
            alert('Bu sayfayı görüntüleyebilmek için giriş yapmalısınız!');
            this.props.history.push("/girisYap")
        }

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

    //Servis Hizmetlerini Db'den çekme
    getProcesses() {
        let token = localStorage.getItem('token');
        if (token == null) {
            alert('Bu sayfayı görüntüleyebilmek için giriş yapmalısınız!');
            this.props.history.push("/girisYap")
        }

        let url = "/api/processes/getprocessdetails";
        fetch(url, {
            method: 'get',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => response.json())
            .then((data) => this.setState({ processes: data }));
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
                        <th>Teşhisler</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {this.state.processes.map((process) => (
                        <tr key={process.processId}>
                            <td>{process.employee}</td>
                            <td>{process.customer}</td>
                            <td>{process.bicycleBrand} {process.bicycleModel}</td>
                            <td>{process.startingDate.replace('T',' ')}</td>
                            <td>{process.competitionDate}</td>
                            <td>{process.diagnostics}</td>
                            <td><Button onClick={this.deleteProcess.bind(this, process.processId)} color="danger">Sil</Button></td>
                            <td><Button onClick={this.updateProcess.bind(this, process.processId)} color="info">Güncelle</Button></td>
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
    setProcess = (id) => {
        this.props.setProcess(id);
    }

    //Servis Hizmeti Güncelleme
    updateProcess(id) {
        this.setProcess(id);
        this.props.history.push("/servisHizmetiGuncelle");
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
