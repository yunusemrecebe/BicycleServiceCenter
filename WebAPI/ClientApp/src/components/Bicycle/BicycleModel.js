import React, { Component, useState } from "react";
import alertify from "alertifyjs";
import { Button, Table, Row, Col, Form, FormGroup, Label, Input } from "reactstrap";
import Select from 'react-select';

export default class BicycleModel extends Component {
    state = {
        bicycleModels: [],
        bicycleBrands: [],
        name: "",
        selectedBrand: 0,
    };

    componentDidMount() {
        this.getBicycleModels();
        this.getBicycleBrands();
    }

    //form verilerini state içerisine aktaran fonksiyon
    handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        this.setState({ [name]: value });
    };

    handleChangeBrand = (event) => {
        this.state.selectedBrand = event.value;
    }

    // Model Ekleme
    addBicycleModel = (event) => {
        event.preventDefault();

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                bicycleBrand: this.state.selectedBrand,
                name: this.state.name,
            }),
        };
        
        fetch("/api/bicyclemodels/add", requestOptions)
            .then(async (response) => {
                const data = await response.json();

                if (!response.ok) {
                    const error = data;
                    return Promise.reject(error);
                }

                this.getBicycleModels();

                Array.from(document.querySelectorAll("input")).forEach((input) => (input.value = ""));
                this.setState({ name: "", selectedBrand: 0 });

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
    
    // Model Ekleme Formu
    addBicycleModelForm() {
        return (
            <Form onSubmit={this.addBicycleModel}>
                <h1> Bisiklet Modeli Ekle</h1>
                <FormGroup>
                    <Label for="name">Model Adı</Label>
                    <Input type="text" name="name" id="name" onChange={this.handleChange} />
                </FormGroup>

                <FormGroup>
                    {this.BicycleBrandSelect(this.state.bicycleBrands)}
                </FormGroup>
  
                <Button>Ekle</Button>
            </Form>
        )
    }

    BicycleBrandSelect(dizi = []) {
        let options = [];
        if (dizi.length != options.length) {
            for (let index = 0; index < dizi.length; index++) {
                options.push({ value: dizi[index].bicycleBrandId, label: dizi[index].name },)
            };
        }

        return <div>
            <Label for="bicycleBrand">Ait Olduğu Marka</Label>
            <Select
                id="bicycleBrand"
                placeholder="Seçiniz"
                options={options}
                onChange={this.handleChangeBrand}
            />
        </div>
    }

    //Model isimlerini Db'den Çekme
    getBicycleModels() {
        let token = localStorage.getItem('token');
        if (token == null) {
            alert('Bu sayfayı görüntüleyebilmek için giriş yapmalısınız!');
            this.props.history.push("/girisYap")
        }

        let url = "/api/bicyclemodels/getdetails";
        fetch(url, {
            method: 'get',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => response.json())
            .then((data) => this.setState({ bicycleModels: data }));
    };

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

    //Db'Den çekilmiş model isimlerini listeleme
    ListBicycleModels() {
        return (
            <Table hover>
                <thead>
                    <tr>
                        <th>Bisiklet Modeli İsmi</th>
                        <th>Ait Olduğu Marka</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {this.state.bicycleModels.map((model) => (
                        <tr key={model.bicycleModelId}>
                            <td>{model.bicycleModelName}</td>
                            <td>{model.bicycleBrandName}</td>
                            <td><Button onClick={this.deleteBicycleModel.bind(this, model.bicycleModelId)} color="danger">Sil</Button></td>
                            <td><Button onClick={this.updateBicycleModel.bind(this, model.bicycleModelId)} color="info">Güncelle</Button></td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        )
    }

    //Model İsmi Silme
    deleteBicycleModel(id){

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        };
        
        fetch("/api/bicyclemodels/delete?id="+id, requestOptions)
            .then(async (response) => {
                const data = await response.json();

                if (!response.ok) {
                    const error = data;
                    return Promise.reject(error);
                }

                this.getBicycleModels();
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

    //Model ismi güncellemek için Model İd gönderen fonksiyon
    setBicycleModel=(id)=>{
        this.props.setBicycleModel(id);
    }

    //Model İsmi Güncelleme
    updateBicycleModel(id){
        this.setBicycleModel(id);
        this.props.history.push("/BisikletModeliGüncelle");
    };

    render() {
        return (
            <div>
                {this.addBicycleModelForm()}

                <Row>
                <h1 className="text-center">Sistemde Kayıtlı Olan Bisiklet Modelleri</h1>
                </Row>
                <Row>
                    <Col md="12">
                        {this.ListBicycleModels()}
                    </Col>
                </Row>

            </div>
        );
    }
}
