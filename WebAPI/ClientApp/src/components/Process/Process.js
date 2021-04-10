import React, { Component, useState } from "react";
import alertify from "alertifyjs";
import { Button, Table, Row, Col, Form, FormGroup, Label, Input } from "reactstrap";

export default class Process extends Component {
    state = {
        processes: [],
        bicycles: [],
        bicycleBrands: [],
        bicycleModels: [],
        customers: [],
        selectedBrand: 0,
        selectedModel: 0,
        selectedCustomer: 0,
        serialNumber: "",
        isLoaded: false,
    };

    componentDidMount() {
        this.getProcesses();
        this.getBicycles();
        this.getBicycleBrands();
        this.getCustomers();
    }

    handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        this.setState({ [name]: value });
    };

    handleChangeBrand = (event) => {
        this.setState({ isLoaded: true });
        this.state.selectedBrand = document.getElementById("brand").value;
        this.getBicycleModels(this.state.selectedBrand);
    }

    handleChangeModel = (event) => {
        this.setState({ selectedModel: parseInt(event.target.value) });
    }

    handleChangeCustomer = (event) => {
        this.setState({ selectedCustomer: parseInt(event.target.value) });
    }

    // Servis Hizmeti Ekleme
    addProcess = (event) => {
        event.preventDefault();

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                brandId: this.state.selectedBrand,
                modelId: this.state.selectedModel,
                ownerId: this.state.selectedCustomer,
                serialNumber: this.state.serialNumber,
            }),
        };

        fetch("/api/bicycles/add", requestOptions)
            .then(async (response) => {
                const data = await response.json();

                if (!response.ok) {
                    const error = data;
                    return Promise.reject(error);
                }

                this.getBicycles();

                Array.from(document.querySelectorAll("input")).forEach((input) => (input.value = ""));
                this.setState({
                    selectedBrand: 0,
                    selectedModel: 0,
                    selectedCustomer: 0,
                    serialNumber: "",
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

                <FormGroup>
                    <Label for="owner">Müşteri</Label>
                    <Input value={this.state.selectedCustomer} type="select" name="owner" id="owner" onChange={this.handleChangeCustomer}>
                        <option selected value={0} >Seçiniz</option>
                        {this.state.customers.map((customer) => (
                            <option key={customer.customerId} value={customer.customerId} >{customer.firstName} {customer.lastName}</option>
                        ))}
                    </Input>
                </FormGroup>

                <Row>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="brand"> Bisiklet Markası</Label>
                            <Input type="select" name="brand" id="brand" onChange={this.handleChangeBrand}>
                                <option selected value={0} >Seçiniz</option>
                                {this.state.bicycleBrands.map((bicycleBrand) => (
                                    <option key={bicycleBrand.bicycleBrandId} value={bicycleBrand.bicycleBrandId}>{bicycleBrand.name}</option>
                                ))}
                            </Input>
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="model">Bisiklet Modeli</Label>
                            <Input value={this.state.selectedModel} type="select" name="model" id="model" onChange={this.handleChangeModel}>
                                <option selected value={0} >Seçiniz</option>
                                {this.state.bicycleModels.map((bicycleModel) => (
                                    <option key={bicycleModel.bicycleModelId} value={bicycleModel.bicycleModelId} >{bicycleModel.name}</option>
                                ))}
                            </Input>
                        </FormGroup>
                    </Col>
                </Row>

                <FormGroup>
                    <Label for="serialNumber">Şase Numarası</Label>
                    <Input type="text" name="serialNumber" id="serialNumber" onChange={this.handleChange} />
                </FormGroup>

                <Button>Ekle</Button>
            </Form>
        )
    }

    //Bisiklet Markalarını Db'den Çekme
    getBicycleBrands() {
        let token = localStorage.getItem('token');
        if (token == null) {
            alert('Bu sayfayı görüntüleyebilmek için giriş yapmalısınız!');
            this.props.history.push("/girisYap")
        }

        let url = "/api/bicyclebrands/getall";
        fetch(url, {
            method: 'get',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => response.json())
            .then((data) => this.setState({ bicycleBrands: data }));
    };

    //Bisiklet Modellerini Db'den Çekme
    getBicycleModels(id) {
        let token = localStorage.getItem('token');
        if (token == null) {
            alert('Bu sayfayı görüntüleyebilmek için giriş yapmalısınız!');
            this.props.history.push("/girisYap")
        }

        let url = "/api/bicyclemodels/getallbybrand?id=" + id;
        fetch(url, {
            method: 'get',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => response.json())
            .then((data) => this.setState({ bicycleModels: data }));

    };

    //Bisikletleri Db'den Çekme
    getBicycles() {
        let token = localStorage.getItem('token');
        if (token == null) {
            alert('Bu sayfayı görüntüleyebilmek için giriş yapmalısınız!');
            this.props.history.push("/girisYap")
        }

        let url = "/api/bicycles/getdetails";
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
                        <th>Bisiklet Markası</th>
                        <th>BisikletModeli</th>
                        <th>Başlangıç Tarihi</th>
                        <th>Tamamlanma Tarihi</th>
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
                            <td>{process.bicycleBrand}</td>
                            <td>{process.bicycleModel}</td>
                            <td>{process.startingDate}</td>
                            <td>{process.competitionDate}</td>
                            <td>{process.diagnostics}</td>
                            <td><Button onClick={this.deleteBicycle.bind(this, process.processId)} color="danger">Sil</Button></td>
                            <td><Button onClick={this.updateBicycle.bind(this, process.processId)} color="info">Güncelle</Button></td>
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
        this.props.history.push("/BisikletGüncelle");
    };

    render() {
        return (
            <div>
                {this.addProcessForm()}

                <Row>
                    <h1 className="text-center">Sistemde Kayıtlı Olan Bisikletler</h1>
                </Row>
                <Row>
                    <Col md="8">
                        {this.ListProcesses()}
                    </Col>
                    <Col md="4"></Col>
                </Row>

            </div>
        );
    }
}
