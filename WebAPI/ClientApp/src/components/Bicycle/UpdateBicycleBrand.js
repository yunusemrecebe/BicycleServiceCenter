import React, { Component } from 'react';
import alertify from "alertifyjs";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";

export default class UpdateBicycleBrand extends Component {

    state = {
        bicycleBrand: [],
        name: "",
    };

    componentDidMount() {
        this.getBicycleBrand(this.props.getBicycleBrand);
    }

    handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        this.setState({ [name]: value });
    };

    //Marka Bilgisini Db'den Çekme
    getBicycleBrand(id) {
        let token = localStorage.getItem('token');
        if (token == null) {
            alert('Bu sayfayı görüntüleyebilmek için giriş yapmalısınız!');
            this.props.history.push("/girisYap")
        }

        let url = "/api/bicyclebrands/get?id="+id;
        fetch(url, {
            method: 'get',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => response.json())
            .then((data) => this.setState({ bicycleBrand: data }));
    };

    //Marka Bilgilerini Güncelleme
    updateBicycleBrand=(event)=>{
        event.preventDefault();
        
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                bicycleBrandId: this.props.getBicycleBrand,
                name: this.state.name != "" ? this.state.name : this.state.bicycleBrand.name,
            }),
        };
        
        fetch("/api/bicyclebrands/update", requestOptions)
            .then(async (response) => {
                
                const data = await response.json();

                if (!response.ok) {
                    const error = data;
                    return Promise.reject(error);
                }

                alertify.success(data.message);
                this.props.history.push("/bisikletMarkası");
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

    //Müşteri güncelleme Form
    updateBicycleBrandForm() {
        return (
            <Form onSubmit={this.updateBicycleBrand}>
                <h1> Personel Bilgilerini Güncelle</h1>
                <FormGroup>
                    <Label for="name">Adı</Label>
                    <Input type="text" name="name" id="name" defaultValue={this.state.bicycleBrand.name} onChange={this.handleChange} />
                </FormGroup>

                <Button>Güncelle</Button>
            </Form>
        )
    }

    render() {
        return (
            <div>
                {this.updateBicycleBrandForm()}
            </div>
        );
    }
};