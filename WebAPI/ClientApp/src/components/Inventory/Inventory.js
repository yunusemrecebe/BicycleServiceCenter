import React, { Component, useState } from "react";
import alertify from "alertifyjs";
import { Button, Table, Row, Col, Form, FormGroup, Label, Input } from "reactstrap";

export default class Inventory extends Component {
    state = {
        inventory: [],
    };

    componentDidMount() {
        this.getInventory();
    }

    handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        this.setState({ [name]: value });
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

    //Envantere ürün Ekleme Formu
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

    //Envanteri Db'den çekme
    getInventory() {
        let token = localStorage.getItem('token');
        if (token == null) {
            alert('Bu sayfayı görüntüleyebilmek için giriş yapmalısınız!');
            this.props.history.push("/girisYap")
        }

        let url = "/api/inventory/getdetails";
        fetch(url, {
            method: 'get',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => response.json())
            .then((data) => this.setState({ inventory: data }));
    };

    //Db'Den çekilmiş Envanter listeleme
    ListInventory() {
        return (
            <Table hover>
                <thead>
                    <tr>
                        <th>Ürün</th>
                        <th>Alış Fiyatı</th>
                        <th>Satış Fiyatı</th>
                        <th>Stoktaki Birim Miktarı</th>
                        <th>Satış Durumu</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {this.state.inventory.map((inventory) => (
                        <tr key={inventory.inventoryId}>
                            <td>{inventory.product}</td>
                            <td>{inventory.purchasePrice}</td>
                            <td>{inventory.sellPrice}</td>
                            <td>{inventory.unitsInStock}</td>
                            <td>{inventory.status}</td>
                            <td><Button onClick={this.deleteStock.bind(this, inventory.inventoryId)} color="danger">Sil</Button></td>
                            <td><Button onClick={this.updateStock.bind(this, inventory.inventoryId)} color="info">Güncelle</Button></td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        )
    }

    //Envanterden stok silme
    deleteStock(id) {

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        };

        fetch("/api/inventory/delete?id=" + id, requestOptions)
            .then(async (response) => {
                const data = await response.json();

                if (!response.ok) {
                    const error = data;
                    return Promise.reject(error);
                }

                this.getInventory();
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

    //Envanter güncellemek için Envanter id'si gönderen fonksiyon
    setInventory = (id) => {
        this.props.setInventory(id);
    }

    //Envanter Güncelleme
    updateStock(id) {
        this.setInventory(id);
        this.props.history.push("/envanterGüncelle");
    };

    render() {
        return (
            <div>
                {/* {this.addProcessForm()} */}

                <Row>
                    <h1 className="text-center">Envanter</h1>
                </Row>
                <Row>
                    <Col md="12">
                        {this.ListInventory()}
                    </Col>
                </Row>

            </div>
        );
    }
}
