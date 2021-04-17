import React, { Component } from 'react';
import alertify from "alertifyjs";
import { Button, Form, FormGroup, Label, Input, Row, Col } from "reactstrap";

export default class UpdateProcess extends Component {

    state = {
        bicycles: [],
        bicycleBrands: [],
        bicycleModels: [],
        customers: [],
        employees: [],
        selectedProcessId: 0,
        selectedEmployeeId: 0,
        selectedCustomerId: 0,
        selectedBicycleId:0,
        selectedEmployeeName: "",
        selectedCustomerName: "",
        selectedBicycle: "",
        startingDate: "",
        competitionDate: "",
        diagnostics: "",
        isProcessLoaded: false,
    };

    componentDidMount() {
        this.getProcessDetailsById(this.props.getProcess);
        this.getBicyclesByCustomer(this.props.getCustomer);
        this.getCustomers();
        this.getEmployees();
    }

    handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        this.setState({ [name]: value });
    };

    handleChangeBicycle = (event) => {
        this.setState({ selectedBicycleId: parseInt(event.target.value) });
    }

    handleChangeEmployee = (event) => {
        this.setState({ selectedEmployeeId: parseInt(event.target.value) });
    }

    handleChangeCustomer = (event) => {
        this.state.selectedCustomerId = document.getElementById("owner").value;
        this.getBicyclesByCustomer(this.state.selectedCustomerId);
    }

    //Müşterileri Db'den çekme
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

    //Servis Hizmeti Detay Bilgisini Db'den Çekme (ProcessDetailDto)
    getProcessDetailsById(id) {
        let token = localStorage.getItem('token');
        if (token == null) {
            alert('Bu sayfayı görüntüleyebilmek için giriş yapmalısınız!');
            this.props.history.push("/girisYap")
        }

        let url = "/api/processes/getprocessdetailsbyid?id=" + id;
        fetch(url, {
            method: 'get',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => response.json())
            .then((data) => this.setState(
                {
                    selectedProcessId: data.processId,
                    selectedEmployeeId: data.employeeId,
                    selectedCustomerId: data.customerId,
                    selectedBicycleId: data.bicycleId,
                    selectedEmployeeName: data.employeeName,
                    selectedCustomerName: data.customerName,
                    selectedBicycle: data.bicycle,
                    startingDate: data.startingDate,
                    competitionDate: data.competitionDate,
                    diagnostics: data.diagnostics,
                    isProcessLoaded: true,
                }));
    };

    //Müşteriye Göre Bisikletleri Db'den Çekme
    getBicyclesByCustomer(id) {
        
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
            .then((data) => this.setState({
                 bicycles: data,
                 selectedBicycleId : data[0].bicycleId,
                 isProcessLoaded: true }));
    
};

    //Bisiklet güncelleme
    updateProcess = (event) => {
        event.preventDefault();

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                processId: this.state.selectedProcessId,
                employeeId: this.state.selectedEmployeeId,
                customerId: this.state.selectedCustomerId,
                bicycleId: this.state.selectedBicycleId,
                startingDate: this.state.startingDate,
                completionDate: this.state.competitionDate,
                diagnostics: this.state.diagnostics,
            }),
        };

        fetch("/api/processes/update", requestOptions)
            .then(async (response) => {
                const data = await response.json();

                if (!response.ok) {
                    const error = data;
                    alertify.error(data.message);
                    alertify.error(data.error);
                    return Promise.reject(error);
                }

                alertify.success(data.message);
                this.props.history.push("/servisHizmeti");
            })

            .catch((responseError) => {
                if (responseError.Errors) {
                    if (responseError.Errors.length > 0) {
                        for (let i = 0; i < responseError.Errors.length; i++) {
                            alertify.error(responseError.Errors[i].ErrorMessage);
                        }
                    }
                    else {
                        alertify.error(responseError.Message);
                    }
                }
            });
    }

    //Bisiklet güncelleme Form
    updateProcessForm() {
        return (
            <Form onSubmit={this.updateProcess}>
                <h1> Servis Hizmeti Güncelle</h1>
                <Row>
                    <Col md={4}>
                        <FormGroup>
                            <Label for="owner">Müşteri</Label>
                            <Input value={this.state.selectedCustomerId} type="select" name="owner" id="owner" onChange={this.handleChangeCustomer}>
                                {this.state.customers.map((customer) => (
                                    <option key={customer.customerId} value={customer.customerId} >{customer.firstName} {customer.lastName}</option>
                                ))}
                            </Input>
                        </FormGroup>
                    </Col>

                    <Col md={4}>
                        {this.state.isProcessLoaded == true ?
                        <FormGroup>
                            <Label for="bicycle">Bisiklet</Label>
                            <Input value={this.state.selectedBicycleId} type="select" name="bicycle" id="bicycle" onChange={this.handleChangeBicycle} >
                                {this.state.bicycles.map((bicycle) => (
                                    <option key={bicycle.bicycleId} value={bicycle.bicycleId}>{bicycle.brandName} {bicycle.modelName}</option>
                                ))}
                            </Input>
                        </FormGroup>
                        :
                        null
                        }
                    </Col>

                    <Col md={4}>
                        <FormGroup>
                            <Label for="employee">Personel</Label>
                            <Input value={this.state.selectedEmployeeId} type="select" name="employee" id="employee" onChange={this.handleChangeEmployee}>
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
                            <Label for="competitionDate">Öngörülen Teslim Tarihi</Label>
                            <Input type="select" name="competitionDate" id="competitionDate" onChange={this.handleChange}>
                                <option selected value={this.state.competitionDate} >{this.state.competitionDate}</option>
                                <option value="1 Gün" >1 Gün</option>
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
                            <Input type="text" name="diagnostics" id="diagnostics" defaultValue={this.state.diagnostics} onChange={this.handleChange}></Input>
                        </FormGroup>
                    </Col>
                </Row>

                <Button>Ekle</Button>
            </Form>
        )
    }

    render() {
        return (
            <div>
                {this.updateProcessForm()}
            </div>
        );
    }
};