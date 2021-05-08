import React, { Component } from 'react';
import { Table, Row, Col, FormGroup, Label } from "reactstrap";
import Select from 'react-select';

export default  class ReportForCustomer extends Component {
    state = {
        reportDetails: [],
        products: [],
        selectedProduct:0
    }

    componentDidMount(){
        this.getProducts();
    }

    handleChangeProduct = (event) => {
        this.state.selectedProduct = event.value;
        console.log(event);
        this.getReport(this.state.selectedProduct);
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

    //Ürünleri Db'den Çekme
    getProducts() {
        let token = localStorage.getItem('token');

        let url = "/api/products/getdetails";
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
            this.setState({ products: data });
        })
    };

    //Raporu ilgili kullanıcıya göre db'den çekme
    getReport(id) {
        let token = localStorage.getItem('token');

        let url = "/api/reports/GetReportForProduct?productId=" + id;
        fetch(url, {
            method: 'get',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(async (response) => {
                const data = await response.json();
                console.log(data.data);
                if (!response.ok) {
                    const error = data;
                    return Promise.reject(error);
                }

                this.setState({ reportDetails: data.data });

            })
            .catch((responseError) => {
                if (responseError.Message == "Token Bulunamadı!") {
                    this.CreateTokenByRefreshToken();
                }
            })
    }

    //Rapordan gelen satın alınmış ürünleri listeleme
    ListToReport() {
        return (
            <Table hover>
                <thead>
                    <tr>
                        <th>Ürün Kodu</th>
                        <th>Ürün</th>
                        <th>Toplam Birim Satış Miktarı</th>
                        <th>Toplam Satış Ücreti</th>
                    </tr>
                </thead>

                <tbody>
                    {this.state.reportDetails.map((reportDetail) => (
                        <tr key={reportDetail.productId}>
                            <td>{reportDetail.productCode}</td>
                            <td>{reportDetail.product}</td>
                            <td>{reportDetail.totalQuantityOfSale}</td>
                            <td>{reportDetail.totalPriceOfSale}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        )
    }

    ProductSelect(dizi = []) {
        let options = [];

        if (dizi.length != options.length) {
            for (let index = 0; index < dizi.length; index++) {
                options.push({ value: dizi[index].productId, label: dizi[index].productCode + " - " + dizi[index].brandName + " " + dizi[index].productName },)
            };
        }

        return <div>
            <Label for="customerSelect">Ürünler</Label>
            <Select
                id="productSelect"
                placeholder="Seçiniz"
                options={options}
                onChange={this.handleChangeProduct}
            />
        </div>

    }

    render() {
        return (
            <div>
                <center><h1> Ürün Hakkında Rapor Oluşturma</h1></center>
                <Row>
                    <Col md={4}>
                        <FormGroup>
                            {this.ProductSelect(this.state.products)}
                        </FormGroup>
                    </Col>
                </Row>
                <hr></hr>
                <h1>Satın Aldığı Ürünler </h1>
                <br></br>
                {this.ListToReport()}
            </div>
        );
    }
}