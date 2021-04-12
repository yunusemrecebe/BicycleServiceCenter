import React, { Component, useState } from "react";
import alertify from "alertifyjs";
import { Button, Table, Row, Col, Form, FormGroup, Label, Input } from "reactstrap";

export default class BicycleBrand extends Component {
    state = {
        bicycleBrands: [],
        name: "",
    };

    componentDidMount() {
        this.getBicycleBrands();
    }

    //form verilerini state içerisine aktaran fonksiyon
    handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        this.setState({ [name]: value });
    };

    // Marka Adı Ekleme
    addBicycleBrand = (event) => {
        event.preventDefault();

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: this.state.name,
            }),
        };
        
        fetch("/api/bicyclebrands/add", requestOptions)
            .then(async (response) => {
                const data = await response.json();

                if (!response.ok) {
                    const error = data;
                    return Promise.reject(error);
                }

                this.getBicycleBrands();

                Array.from(document.querySelectorAll("input")).forEach((input) => (input.value = ""));
                this.setState({ name: "" });

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

    // Marka Ekleme Formu
    addBicycleBrandForm() {
        return (
            <Form onSubmit={this.addBicycleBrand}>
                <h1> Bisiklet Markası Ekle</h1>
                <FormGroup>
                    <Label for="name">Adı</Label>
                    <Input type="text" name="name" id="name" onChange={this.handleChange} />
                </FormGroup>
  
                <Button>Ekle</Button>
            </Form>
        )
    }

    //Marka isimlerini Db'den Çekme
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

    //Db'Den çekilmiş marka isimlerini listeleme
    ListBicycleBrands() {
        return (
            <Table hover>
                <thead>
                    <tr>
                        <th>Bisiklet Markası İsmi</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {this.state.bicycleBrands.map((brand) => (
                        <tr key={brand.bicycleBrandId}>
                            <td>{brand.name}</td>
                            <td><Button onClick={this.deleteBicycleBrand.bind(this, brand.bicycleBrandId)} color="danger">Sil</Button></td>
                            <td><Button onClick={this.updateBicycleBrand.bind(this, brand.bicycleBrandId)} color="info">Güncelle</Button></td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        )
    }

    //Marka İsmi Silme
    deleteBicycleBrand(id){

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        };
        
        fetch("/api/bicyclebrands/delete?id="+id, requestOptions)
            .then(async (response) => {
                const data = await response.json();

                if (!response.ok) {
                    const error = data;
                    return Promise.reject(error);
                }

                this.getBicycleBrands();
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
    setBicycleBrand=(id)=>{
        this.props.setBicycleBrand(id);
    }

    //Marka İsmi Güncelleme
    updateBicycleBrand(id){
        this.setBicycleBrand(id);
        this.props.history.push("/BisikletMarkasıGüncelle");
    };

    render() {
        return (
            <div>
                {this.addBicycleBrandForm()}

                <Row>
                <h1 className="text-center">Sistemde Kayıtlı Olan Bisiklet Markaları</h1>
                </Row>
                <Row>
                    <Col md="12">
                        {this.ListBicycleBrands()}
                    </Col>
                </Row>

            </div>
        );
    }
}
