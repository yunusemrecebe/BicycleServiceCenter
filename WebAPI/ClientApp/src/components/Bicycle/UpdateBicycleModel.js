import React, { Component } from 'react';
import alertify from "alertifyjs";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";

export default class UpdateBicycleModel extends Component {

    state = {
        bicycleBrands:[],
        selectedModelId: 0,
        selectedBrandId: 0,
        selectedBrandName: "",
        selectedModelName: "",
        name: "",
    };

    componentDidMount() {
        this.getBicycleModel(this.props.getBicycleModel);
        this.getBicycleBrands();
    }

    handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        this.setState({ [name]: value });
    };

    handleChangeBrand = (event) => {
        this.setState({ selectedBrandId: parseInt(event.target.value) });
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

    //Bisiklet Modellerini Db'den Çekme
    getBicycleModel(id) {
        let token = localStorage.getItem('token');

        let url = "/api/bicyclemodels/getdetailsbyid?id=" + id;
        fetch(url, {
            method: 'get',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(async (response) => {
                const data = await response.json();

                if (!response.ok) {
                    const error = data;
                    return Promise.reject(error);
                }

                this.setState({ 
                    selectedModelId: data.bicycleModelId,
                    selectedBrandId: data.bicycleBrandId,
                    selectedBrandName: data.bicycleBrandName,
                    selectedModelName: data.bicycleModelName,
                 });

            })
            .catch((responseError) => {
                if (responseError.Message == "Token Bulunamadı!") {
                    this.CreateTokenByRefreshToken();
                }
            })
    };

    //Model Bilgilerini Güncelleme
    updateBicycleModel=(event)=>{
        event.preventDefault();
        
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                bicycleModelId: this.props.getBicycleModel,
                bicycleBrand: this.state.selectedBrandId,
                name: this.state.name != "" ? this.state.name : this.state.selectedModelName,
            }),
        };
        
        fetch("/api/bicyclemodels/update", requestOptions)
            .then(async (response) => {
                
                const data = await response.json();

                if (!response.ok) {
                    const error = data;
                    return Promise.reject(error);
                }

                alertify.success(data.message);
                this.props.history.push("/bisiklet/model/listele");
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

    //Model güncelleme Form
    updateBicycleModelForm() {
        return (
            <Form onSubmit={this.updateBicycleModel}>
                <h1> Model Bilgilerini Güncelle</h1>
                <FormGroup>
                    <Label for="name">Model Adı</Label>
                    <Input type="text" name="name" id="name" defaultValue={this.state.selectedModelName} onChange={this.handleChange} />
                </FormGroup>

                <FormGroup>
                    <Label for="brand">Marka</Label>
                    <Input value={this.state.selectedBrandId} type="select" name="selectedBrandId" id="brand" onChange={this.handleChangeBrand}>
                        {this.state.bicycleBrands.map((bicycleBrand) => (
                            <option key={bicycleBrand.bicycleBrandId} value={bicycleBrand.bicycleBrandId}>{bicycleBrand.name}</option>
                        ))}
                    </Input>
                </FormGroup>

                <Button>Güncelle</Button>
            </Form>
        )
    }

    render() {
        return (
            <div>
                {this.updateBicycleModelForm()}
            </div>
        );
    }
};