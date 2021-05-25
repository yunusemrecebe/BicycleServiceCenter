import React, { Component} from "react";
import alertify from "alertifyjs";
import { Button, Table, Row, Col} from "reactstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery.min.js';
import "datatables.net-dt/js/dataTables.dataTables"
import "datatables.net-dt/css/jquery.dataTables.min.css"
import $ from 'jquery';

export default class BicycleBrand extends Component {
    state = {
        bicycleBrands: [],
    };

    componentDidUpdate(){
        $(document).ready(function () {
            $('#dataTable').DataTable();
        });
    }

    componentDidMount() {
        this.getBicycleBrands();
    }    

    //Marka isimlerini Db'den Çekme
    getBicycleBrands() {
        let token = localStorage.getItem('token');

        let url = "/api/bicyclebrands/getall";
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

                this.setState({ bicycleBrands: data });

            })
            .catch((responseError) => {
                if (responseError.Message == "Token Bulunamadı!") {
                    this.CreateTokenByRefreshToken();
                }
            })
    };

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

    //Db'Den çekilmiş marka isimlerini listeleme
    ListBicycleBrands() {
        return (
            <Table hover id="dataTable">
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
        this.props.history.push("/bisiklet/marka/guncelle");
    };

    render() {
        return (
            <div>
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
