import React, { Component } from 'react';
import alertify from "alertifyjs";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";

export default class UpdateEmployee extends Component {

    state = {
        employee: [],
        firstName: "",
        lastName: "",
        phone: "",
    };

    componentDidMount() {
        this.getEmployee(this.props.getEmployee);
    }

    handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        this.setState({ [name]: value });
    };

    //Personel Bilgisini Db'den Çekme
    getEmployee(id) {
        let token = localStorage.getItem('token');
        if (token == null) {
            alert('Bu sayfayı görüntüleyebilmek için giriş yapmalısınız!');
            this.props.history.push("/login")
        }

        let url = "/api/employees/get?id="+id;
        fetch(url, {
            method: 'get',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => response.json())
            .then((data) => this.setState({ employee: data }));
    };

    //Personel Bilgilerini Güncelleme
    updateEmployee=(event)=>{
        event.preventDefault();
        
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                employeeId: this.props.getEmployee,
                firstName: this.state.firstName != "" ? this.state.firstName : this.state.employee.firstName,
                lastName: this.state.lastName != "" ? this.state.lastName : this.state.employee.lastName,
                phone: this.state.phone != "" ? this.state.phone : this.state.employee.phone,
            }),
        };
        
        fetch("/api/employees/update", requestOptions)
            .then(async (response) => {
                const data = await response.json();

                if (!response.ok) {
                    const error = data;
                    return Promise.reject(error);
                }

                alertify.success(data.message);
                this.props.history.push("/Personeller");
            })

            .catch((responseError) => {
                if (responseError.Errors) {
                    if (responseError.Errors.length > 0) {
                        for (let i = 0; i < responseError.Errors.length; i++) {
                            alertify.error(responseError.Errors[i].ErrorMessage);
                        }
                    }
                    else{
                        alertify.error(responseError.Message);
                    }
                }
            }); 
    }

    //Personel güncelleme Form
    updateEmployeeForm() {
        return (
            <Form onSubmit={this.updateEmployee}>
                <h1> Personel Bilgilerini Güncelle</h1>
                <FormGroup>
                    <Label for="firstName">Adı</Label>
                    <Input type="text" name="firstName" id="firstName" defaultValue={this.state.employee.firstName} onChange={this.handleChange} />
                </FormGroup>

                <FormGroup>
                    <Label for="lastName">Soyadı</Label>
                    <Input type="text" name="lastName" id="lastName" defaultValue={this.state.employee.lastName} onChange={this.handleChange} />
                </FormGroup>

                <FormGroup>
                    <Label for="phone">Telefon</Label>
                    <Input type="text" name="phone" id="phone" defaultValue={this.state.employee.phone} onChange={this.handleChange} />
                </FormGroup>

                <Button>Güncelle</Button>
            </Form>
        )
    }

    render() {
        return (
            <div>
                {this.updateEmployeeForm()}
            </div>
        );
    }
};