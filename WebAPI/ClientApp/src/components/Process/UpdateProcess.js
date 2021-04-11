import React, { Component } from 'react';
import alertify from "alertifyjs";
import { Button, Form, FormGroup, Label, Input, Row, Col } from "reactstrap";

export default class UpdateProcess extends Component {

    state = {
        bicycles: [],
        bicycleBrands: [],
        bicycleModels: [],
        customers: [],
        selectedEmployeeId: 0,
        selectedCustomerId: 0,
        selectedBrandId: 0,
        selectedModelId: 0,
        selectedEmployeeName: "",
        selectedCustomerName: "",
        selectedBrandName: "",
        selectedModelName: "",
        startingDate: "",
        competitionDate: "",
        diagnostics: "",
        isProcessLoaded: false,
    };

    componentDidMount() {
        this.getProcessDetailsById(this.props.getProcess);
        this.getBicyclesByCustomer(this.props.getCustomer);
        //this.getBicycleBrands();
        //this.getBicycleModels();
        //this.getCustomers();
    }

    handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        this.setState({ [name]: value });
    };

    handleChangeBrand = (event) => {
        this.setState({ selectedBrandId: parseInt(event.target.value) });
    }

    handleChangeModel = (event) => {
        this.setState({ selectedModelId: parseInt(event.target.value) });
    }

    handleChangeCustomer = (event) => {
        this.setState({ selectedCustomerId: parseInt(event.target.value) });
    }

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
                .then((data) => this.setState({ bicycles: data }));
        
    };

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
                    selectedEmployeeId: data.employeeId,
                    selectedCustomerId: data.customerId,
                    selectedBrandId: data.bicycleBrandId,
                    selectedModelId: data.bicycleModelId,
                    selectedEmployeeName: data.employeeName,
                    selectedCustomerName: data.customerName,
                    selectedBrandName: data.bicycleBrandName,
                    selectedModelName: data.bicycleModelName,
                    startingDate: data.startingDate,
                    competitionDate: data.competitionDate,
                    diagnostics: data.diagnostics,
                    isProcessLoaded: true,
                }));
    };

    //Bisiklet güncelleme
    updateProcess = (event) => {
        event.preventDefault();

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                bicycleId: this.props.getBicycle,
                brandId: this.state.selectedBrandId,
                modelId: this.state.selectedModelId,
                ownerId: this.state.selectedCustomerId,
                serialNumber: this.state.serialNumber,
            }),
        };

        fetch("/api/bicycles/update", requestOptions)
            .then(async (response) => {
                const data = await response.json();

                if (!response.ok) {
                    const error = data;
                    return Promise.reject(error);
                }

                alertify.success(data.message);
                this.props.history.push("/bisikletler");
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
                            <Input value={this.state.selectedCustomer} type="select" name="owner" id="owner" onChange={this.handleChangeCustomer}>
                                <option selected value={this.state.selectedCustomerId} >{this.state.selectedCustomerName}</option>
                                {/* {this.state.customers.map((customer) => (
                                    <option key={customer.customerId} value={customer.customerId} >{customer.firstName} {customer.lastName}</option>
                                ))} */}
                            </Input>
                        </FormGroup>
                    </Col>

                    <Col md={4}>
                        {this.state.isProcessLoaded == true ?
                        <FormGroup>
                            <Label for="bicycle">Bisiklet</Label>
                            <Input type="select" name="bicycle" id="bicycle" onChange={this.handleChangeBicycle}>
                                <option selected value={0} >{this.state.bicycles.brandName} {this.state.bicycles.modelName}</option>
                                {/* {this.state.bicycles.map((bicycle) => (
                                    <option key={bicycle.bicycleId} value={bicycle.bicycleId}>{bicycle.brandName} {bicycle.modelName}</option>
                                ))} */}
                            </Input>
                        </FormGroup>
                        :
                        null
                        }
                    </Col>

                    <Col md={4}>
                        <FormGroup>
                            <Label for="employee">Personel</Label>
                            <Input type="select" name="employee" id="employee" onChange={this.handleChangeEmployee}>
                                <option selected value={this.state.selectedEmployeeId} >{this.state.selectedEmployeeName}</option>selectedBicycleId
                                {/* {this.state.employees.map((employee) => (
                                    <option key={employee.employeeId} value={employee.employeeId}>{employee.firstName} {employee.lastName}</option>
                                ))} */}
                            </Input>
                        </FormGroup>
                    </Col>
                </Row>

                <Row>
                    <Col md={4}>
                        <FormGroup>
                            <Label for="completionDate">Öngörülen Teslim Tarihi</Label>
                            <Input type="select" name="completionDate" id="completionDate" onChange={this.handleChange}>
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