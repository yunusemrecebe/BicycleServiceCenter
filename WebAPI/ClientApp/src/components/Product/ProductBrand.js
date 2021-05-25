import React, { Component } from "react";
import alertify from "alertifyjs";
import { Button, Table, Row, Col } from "reactstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery.min.js';
import "datatables.net-dt/js/dataTables.dataTables"
import "datatables.net-dt/css/jquery.dataTables.min.css"
import $ from 'jquery';

export default class ProductBrand extends Component {
    state = {
        productBrands: [],
        name: "",
    };
    
    componentDidUpdate(){
        $(document).ready(function () {
            $('#dataTable').DataTable();
        });
    }

    componentDidMount() {
        this.getProductBrands();
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
                    this.props.history.push("/kullanici/giris")
                }
            });
    }

    //Marka isimlerini Db'den Çekme
    getProductBrands() {
        let token = localStorage.getItem('token');

        let url = "/api/productbrands/getall";
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

                this.setState({ productBrands: data });

            })
            .catch((responseError) => {
                if (responseError.Message == "Token Bulunamadı!") {
                    this.CreateTokenByRefreshToken();
                }
            })
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
        this.setProductBrand(id);
        this.props.history.push("/urun/marka/guncelle");
    };

    //Db'Den çekilmiş marka isimlerini listeleme
    ListProductBrands() {
        return (
            <Table hover id="dataTable">
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
