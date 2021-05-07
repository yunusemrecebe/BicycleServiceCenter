import React, { Component } from 'react';
import { Table, Row, Col, FormGroup, Label } from "reactstrap";
import Select from 'react-select';

export default  class ReportForCustomer extends Component {
    state = {
        reportDetails: [],
        consumedParts: [],
        customers: [],
        selectedCustomer:0
    }

    componentDidMount(){
        this.getCustomers();
    }

    handleChangeCustomer = (event) => {
        this.state.selectedCustomer = event.value;
        this.getReport(this.state.selectedCustomer);
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

    //Müşterileri Db'den çekme
    getCustomers() {
        let token = localStorage.getItem('token');

        let url = "/api/customers/getall";
        fetch(url, {
            method: 'get',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => response.json())
            .then((data) => this.setState({ customers: data }));
    };

    //Raporu ilgili kullanıcıya göre db'den çekme
    getReport(id) {
        let token = localStorage.getItem('token');

        let url = "/api/reports/GetReportForCustomer?customerId=" + id;
        fetch(url, {
            method: 'post',
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

                this.setState({ reportDetails: data.data, consumedParts: data.data.purchasedProducts });

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
                        <th>Adet</th>
                        <th>Birim Fiyat</th>
                        <th>Toplam Fiyat</th>
                        <th>İndirim Oranı</th>
                    </tr>
                </thead>

                <tbody>
                    {this.state.consumedParts.map((consumedPart) => (
                        <tr key={consumedPart.consumedPartId}>
                            <td>{consumedPart.productCode}</td>
                            <td>{consumedPart.product}</td>
                            <td>{consumedPart.quantity}</td>
                            <td>{consumedPart.unitPrice}</td>
                            <td>{consumedPart.totalPrice}</td>
                            <td>{consumedPart.discount}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        )
    }

    CustomerSelect(dizi = []) {
        let options = [];

        if (dizi.length != options.length) {
            for (let index = 0; index < dizi.length; index++) {
                options.push({ value: dizi[index].customerId, label: dizi[index].firstName + " " + dizi[index].lastName },)
            };
        }

        return <div>
            <Label for="customerSelect">Müşteri</Label>
            <Select
                id="customerSelect"
                placeholder="Seçiniz"
                options={options}
                onChange={this.handleChangeCustomer}
            />
        </div>

    }

    render() {
        return (
            <div>
                <center><h1> Müşteri Hakkında Rapor Oluşturma</h1></center>
                <Row>
                    <Col md={4}>
                        <FormGroup>
                            {this.CustomerSelect(this.state.customers)}
                        </FormGroup>
                    </Col>
                </Row>

                <br></br>
                <Row>
                    <Col md="6"><h3>Toplam Servis Hizmeti Sayısı: {this.state.reportDetails.totalQuantityOfReceivedProcesses}</h3></Col>
                    <Col md="6"><h3>Ödediği Toplam Ücret: {this.state.reportDetails.overallCharge}</h3></Col>
                </Row>
                <hr></hr>
                <h1>Satın Aldığı Ürünler </h1>
                <br></br>
                {this.ListToReport()}
            </div>
        );
    }
}