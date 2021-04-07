import React, { Component } from 'react';
import alertify from "alertifyjs";
import {Button, Table, FormGroup, Row, Col} from "reactstrap";

export default class UpdateProduct extends Component {

    state = {
        productBrand: [],
        name: "",
        id: "",
    };

    componentDidMount() {
        this.getProductBrandsById(this.props.getProductBrand);
    }

    handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        this.setState({ [name]: value });
    };

    //Marka Bilgisini Db'den Çekme
    getProductBrandsById(id) {
        let token = localStorage.getItem('token');
        if (token == null) {
            alert('Bu sayfayı görüntüleyebilmek için giriş yapmalısınız!');
            this.props.history.push("/login")
        }

        let url = "/api/productbrands/get?id="+id;
        fetch(url, {
            method: 'get',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => response.json())
            .then((data) => this.setState({ productBrand: data }));
    };

    updateProduct=(event)=>{
        event.preventDefault();
        
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: this.state.name,
                productBrandId: this.props.getProductBrand,
            }),
        };
        
        fetch("/api/productbrands/update", requestOptions)
            .then(async (response) => {
                const data = await response.json();

                if (!response.ok) {
                    const error = data;
                    return Promise.reject(error);
                }

                alertify.warning("Ürün Markası Güncellendi!");
                this.props.history.push("/ÜrünMarkası");
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
                else{
                    console.log("sa");
                }
            }); 
    }

    render() {
        return (
            <div>
                <form onSubmit={this.updateProduct}>
                    <FormGroup>
                        <label htmlFor="productName">Marka Adı</label>
                        <input type="text" id="productName" name="name" defaultValue={this.state.productBrand.name} onChange={this.handleChange}></input>
                        <button type="submit">Ekle</button>
                    </FormGroup>
                </form>
            </div>
        );
    }
};