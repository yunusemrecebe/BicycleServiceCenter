import React, { Component } from 'react';
import alertify from "alertifyjs";
import {Button, Table, FormGroup, Row, Col} from "reactstrap";

export default class UpdateProductCategory extends Component {

    state = {
        productCategory: [],
        name: "",
        id: "",
    };

    componentDidMount() {
        this.getProductCategoriesById(this.props.getProductCategory);
    }

    handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        this.setState({ [name]: value });
    };

    //Kategori Bilgisini Db'den Çekme
    getProductCategoriesById(id) {
        let token = localStorage.getItem('token');
        if (token == null) {
            alert('Bu sayfayı görüntüleyebilmek için giriş yapmalısınız!');
            this.props.history.push("/login")
        }

        let url = "/api/productcategories/get?id="+id;
        fetch(url, {
            method: 'get',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => response.json())
            .then((data) => this.setState({ productCategory: data }));
    };

    updateProductCategory=(event)=>{
        event.preventDefault();
        
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: this.state.name,
                productCategoryId : this.props.getProductCategory,
            }),
        };
        
        fetch("/api/productCategories/update", requestOptions)
            .then(async (response) => {
                const data = await response.json();

                if (!response.ok) {
                    const error = data;
                    return Promise.reject(error);
                }

                alertify.success("Ürün Kategorisi Güncellendi!");
                this.props.history.push("/ÜrünKategorisi");
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

    render() {
        return (
            <div>
                <form onSubmit={this.updateProductCategory}>
                    <FormGroup>
                        <label htmlFor="productCategory">Kategori Adı</label>
                        <input type="text" id="productCategory" name="name" defaultValue={this.state.productCategory.name} onChange={this.handleChange}></input>
                        <button type="submit">Ekle</button>
                    </FormGroup>
                </form>
            </div>
        );
    }
};