import React, { Component, useState } from "react";
import alertify from "alertifyjs";
import { Button, Label, Input, Table, FormGroup, Row, Col } from "reactstrap";

export default class ProductBrand extends Component {
    state = {
        productBrands: [],
        name: "",
    };

    componentDidMount() {
        this.getProductBrands();
    }

    //form verilerini state içerisine aktaran fonksiyon
    handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        this.setState({ [name]: value });
    };

    // Marka Adı Ekleme
    addProduct = (event) => {
        event.preventDefault();

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: this.state.name,
            }),
        };



        fetch("/api/productbrands/add", requestOptions)
            .then(async (response) => {
                const data = await response.json();

                if (!response.ok) {
                    const error = data;
                    return Promise.reject(error);
                }

                this.getProductBrands();
                Array.from(document.querySelectorAll("input")).forEach((input) => (input.value = ""));
                this.setState({ name: "" });
                alertify.success("Ürün Markası Eklendi!");
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

    //Marka isimlerini Db'den Çekme
    getProductBrands() {
        let token = localStorage.getItem('token');
        if (token == null) {
            alert('Bu sayfayı görüntüleyebilmek için giriş yapmalısınız!');
            this.props.history.push("/login")
        }

        let url = "/api/productbrands/getall";
        fetch(url, {
            method: 'get',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => response.json())
            .then((data) => this.setState({ productBrands: data }));
    };

    //Marka İsmi Silme
    deleteProductBrand(id) {

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        };

        fetch("/api/productbrands/delete?id=" + id, requestOptions)
            .then(async (response) => {
                const data = await response.json();

                if (!response.ok) {
                    const error = data;
                    return Promise.reject(error);
                }

                this.getProductBrands();
                alertify.warning("Ürün Markası Silindi!");
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
    setProductBrand = (id) => {
        this.props.setProductBrand(id);
    }

    //Marka İsmi Güncelleme
    updateProductBrand(id) {
        //this.props.setProductBrand(id)
        this.setProductBrand(id);
        //localStorage.setItem('productBrandId',id)
        this.props.history.push("/ÜrünMarkasıGüncelle");
    };

    //Db'Den çekilmiş marka isimlerini listeleme
    ListProductBrands() {
        return (
            <Table hover>
                <thead>
                    <tr>
                        <th>Ürün Markası İsmi</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {this.state.productBrands.map((brand) => (
                        <tr key={brand.productBrandId}>
                            <td>{brand.name}</td>
                            <td><Button onClick={this.deleteProductBrand.bind(this, brand.productBrandId)} color="danger">Sil</Button></td>
                            <td><Button onClick={this.updateProductBrand.bind(this, brand.productBrandId)} color="info">Güncelle</Button></td>
                            {/* <td><Button onClick={() => this.props.setProductBrand(brand.productBrandId)} color="info">Güncelle</Button></td> */}
                        </tr>
                    ))}
                </tbody>
            </Table>
        )
    }

    render() {
        return (
            <div>
                <Row>
                    <Col md="3">
                        <form onSubmit={this.addProduct}>
                            <h1> Marka Ekle</h1>
                            <FormGroup>
                                <Label for="name">Marka Adı</Label>
                                <Input type="text" name="name" id="name" onChange={this.handleChange} />
                            </FormGroup>
                            <Button type="submit">Ekle</Button>
                        </form>
                    </Col>
                    <Col md="9"></Col>
                </Row>

                <Row>
                    <h1 className="text-center">Sistemde Kayıtlı Olan Ürün Markaları</h1>
                </Row>
                <Row>
                    <Col md="12">
                        {this.ListProductBrands()}
                    </Col>
                </Row>

            </div>
        );
    }
}
