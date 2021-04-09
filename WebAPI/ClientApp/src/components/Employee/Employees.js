import React, { Component, useState } from "react";
import alertify from "alertifyjs";
import { Button, Table, Row, Col, Form, FormGroup, Label, Input } from "reactstrap";

export default class ProductBrand extends Component {
    state = {
        employees: [],
        firstName: "",
        lastName: "",
        phone: "",
    };

    componentDidMount() {
        this.getEmployees();
    }

    //form verilerini state içerisine aktaran fonksiyon
    handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        this.setState({ [name]: value });
    };

    // Personel Ekleme
    addEmployee = (event) => {
        event.preventDefault();
        console.log(this.state.firstName + "\n" + this.state.lastName + "\n" + this.state.phone + "\n" );

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
            body: JSON.stringify({
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                phone: this.state.phone,
            }),
        };

        fetch("/api/employees/add", requestOptions)
            .then(async (response) => {
                const data = await response.json();

                if (!response.ok) {
                    const error = data;
                    return Promise.reject(error);
                }

                this.getEmployees();

                Array.from(document.querySelectorAll("input")).forEach((input) => (input.value = ""));
                this.setState({ 
                  firstName: "",
                  lastName: "",
                  phone: "",
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
                    else{
                        alertify.error(responseError);
                    }
                }
                else{
                    alertify.error(responseError.message);
                }
            });
    };

    // Personel Ekleme Formu
    addEmployeeForm() {
      return (
          <Form onSubmit={this.addEmployee}>
              <h1> Personel Ekle</h1>
              <FormGroup>
                  <Label for="firstName">Adı</Label>
                  <Input type="text" name="firstName" id="firstName" onChange={this.handleChange} />
              </FormGroup>

              <FormGroup>
                  <Label for="lastName">Soyadı</Label>
                  <Input type="text" name="lastName" id="lastName" onChange={this.handleChange} />
              </FormGroup>

              <FormGroup>
                  <Label for="phone">Telefon</Label>
                  <Input type="text" name="phone" id="phone" onChange={this.handleChange}/>
              </FormGroup>

              <Button>Ekle</Button>
          </Form>
      )
  }

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

    //Db'Den çekilmiş personelleri listeleme
    ListEmployees() {
      return (
          <Table hover>
              <thead>
                  <tr>
                      <th>Ad Soyad</th>
                      <th>Telefon</th>
                      <th></th>
                  </tr>
              </thead>

              <tbody>
                  {this.state.employees.length > 0 ? this.state.employees.map((employee) => (
                      <tr key={employee.employeeId}>
                          <td>{employee.firstName} {employee.lastName}</td>
                          <td>{employee.phone}</td>
                          <td><Button onClick={this.deleteEmployee.bind(this, employee.employeeId)} color="danger">Sil</Button></td>
                          <td><Button onClick={this.updateProductBrand.bind(this, employee.employeeId)} color="info">Güncelle</Button></td>
                      </tr>
                  ))
                :
                <h1>Sistemde kayıtlı personel bulunamadı!</h1>
                }
              </tbody>
          </Table>
      )
  }

    //Personel Silme
    deleteEmployee(id){

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
        
        fetch("/api/employees/delete?id="+id, requestOptions)
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

    //Marka ismi güncellemek için Marka İd gönderen fonksiyon
    setProductBrand=(id)=>{
        this.props.setProductBrand(id);
    }

    //Marka İsmi Güncelleme
    updateProductBrand(id){
        //this.props.setProductBrand(id)
        this.setProductBrand(id);
        //localStorage.setItem('productBrandId',id)
        this.props.history.push("/ÜrünMarkasıGüncelle");
    };

    render() {
        return (
            <div>
               {this.addEmployeeForm()}

                <Row>
                <h1 className="text-center">Sistemde Kayıtlı Olan Personeller</h1>
                </Row>
                <Row>
                    <Col md="8">
                        {this.ListEmployees()}
                    </Col>
                    <Col md="4"></Col>
                </Row>

            </div>
        );
    }
}
