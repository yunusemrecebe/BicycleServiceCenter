import React, { Component } from 'react';
import alertify from "alertifyjs";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";

export default class UpdateBicycleModel extends Component {

    state = {
        bicycleModel: [],
        name: "",
    };

    componentDidMount() {
        this.getBicycleModel(this.props.getBicycleModel);
    }

    handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        this.setState({ [name]: value });
    };

    //Model Bilgisini Db'den Çekme
    getBicycleModel(id) {
        let token = localStorage.getItem('token');
        if (token == null) {
            alert('Bu sayfayı görüntüleyebilmek için giriş yapmalısınız!');
            this.props.history.push("/girisYap")
        }

        let url = "/api/bicyclemodels/get?id="+id;
        fetch(url, {
            method: 'get',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => response.json())
            .then((data) => this.setState({ bicycleModel: data }));
    };

    //Model Bilgilerini Güncelleme
    updateBicycleModel=(event)=>{
        event.preventDefault();
        
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                bicycleModelId: this.props.getBicycleModel,
                name: this.state.name != "" ? this.state.name : this.state.bicycleModel.name,
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
                this.props.history.push("/bisikletModeli");
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
                    <Label for="name">Adı</Label>
                    <Input type="text" name="name" id="name" defaultValue={this.state.bicycleModel.name} onChange={this.handleChange} />
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