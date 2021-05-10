import React, { Component, useState } from "react";
import alertify from "alertifyjs";
import { Button, Table, Row, Col, Form, FormGroup, Label, Input } from "reactstrap";
import Select from 'react-select';

export default class AddProcess extends Component {
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

                Array.from(document.querySelectorAll("input")).forEach((input) => (input.value = ""));
                this.setState({
                    selectedEmployee: 0,
                    selectedCustomer: 0,
                    selectedBicycle: 0,
                    completionDate: "1 Gün",
                    diagnostics: "",
                });

                alertify.success(data.message);
                this.props.history.push("/servis/listele");
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
        return <div style= {{minHeight: 750 + 'px'}}>
             <Form onSubmit={this.addProcess}>
                <h1> Servis Hizmeti Ekle</h1>
                <Table borderless>
                    <thead>
                        <tr>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope="row">Müşteri</th>

                            <td>
                                {this.CustomerSelect(this.state.customers)}
                            </td>
                        </tr>

                        <tr>
                            <th scope="row">Bisiklet</th>

                            <td>
                                {this.BicycleSelect(this.state.bicycles)}
                            </td>
                        </tr>

                        <tr>
                            <th scope="row">Personel</th>

                            <td>
                                {this.EmployeeSelect(this.state.employees)}
                            </td>
                        </tr>

                        <tr>
                            <th scope="row">Öngörülen Teslim Tarihi</th>

                            <td>
                                {this.CompletionDateSelect()}
                            </td>
                        </tr>

                        <tr>
                            <th>Teşhisler</th>

                            <td>
                                <Input type="textarea" name="diagnostics" id="diagnostics" onChange={this.handleChange}></Input>
                            </td>
                        </tr>

                    </tbody>
                </Table>

                <Button>Ekle</Button>
            </Form>
        </div>
    }

    CustomerSelect(dizi = []) {

        if (dizi.length != this.state.customerOptions.length) {
            for (let index = 0; index < dizi.length; index++) {
                this.state.customerOptions.push({ value: dizi[index].customerId, label: dizi[index].firstName + " " + dizi[index].lastName },)
            };
        }

        return <div>
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
            <Select
                id="completionDate"
                placeholder="Seçiniz"
                options={options}
                onChange={this.handleChangeCompletionDate}
            />
        </div>
    }

    render() {
        return (
            <div>
                {this.addProcessForm()}
            </div>
        );
    }
}
