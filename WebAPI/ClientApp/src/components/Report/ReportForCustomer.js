import React, { Component } from 'react';
import { Table, Row, Col, Form, FormGroup, Label, Button, Input } from "reactstrap";
import Select from 'react-select';
import '../../css/date.css';
import alertify from "alertifyjs";

export default class ReportForCustomer extends Component {
    state = {
        reportDetails: [],
        consumedProducts: [],
        customers: [],
        selectedCustomer: 0,
        dataFiltered: false,
        begin: null,
        end: null
    }

    componentDidMount() {
        this.getCustomers();
    }

    handleChangeCustomer = (event) => {
        this.state.selectedCustomer = event.value;
        this.getReport(this.state.selectedCustomer);
    }

    handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        this.setState({ [name]: value });
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
                    this.props.history.push("/kullanici/giris")
                }
            });
    }

    //Müşterileri Db'den Çekme
    getCustomers() {
        let token = localStorage.getItem('token');

        let url = "/api/customers/getall";
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

                this.setState({ customers: data });

            })
            .catch((responseError) => {
                if (responseError.Message == "Token Bulunamadı!") {
                    this.CreateTokenByRefreshToken();
                }
            })
    };

    //Raporu ilgili kullanıcıya göre db'den çekme
    getReport(id) {
        let token = localStorage.getItem('token');

        let url = "/api/reports/GetReportForCustomer?customerId=" + id;
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

                this.setState({ reportDetails: data.data, consumedProducts: data.data.purchasedProducts, begin: null, end: null, dataFiltered: false });
                Array.from(document.querySelectorAll("input")).forEach((input) => (input.value = ""));

            })
            .catch((responseError) => {
                if (responseError.Message == "Token Bulunamadı!") {
                    this.CreateTokenByRefreshToken();
                }
            })
    }

    GetFilteredReportByDateRange(id, begin, end) {
        if (id == 0) {
            alertify.error("Müşteri seçilmeden önce filtreleme işlemi yapılamaz!!");
            return;
        }

        if (begin == null || end == null) {
            alertify.error("Başlangıç ve Bitiş tarihi belirtilmeden filtreleme işlemi gerçekleştirilemez!");
            return;
        }

        let token = localStorage.getItem('token');

        let url = "/api/reports/GetFilteredReportForCustomerByDateRange?customerId=" + id + "&begin=" + begin + "&end=" + end;
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

                if (data.data.purchasedProducts.length == 0) {
                    this.setState({ reportDetails: null, consumedProducts: null, dataFiltered: true });
                }
                else {
                    this.setState({ reportDetails: data.data, consumedProducts: data.data.purchasedProducts, dataFiltered: true });
                }
                this.ListToReport();
            })
            .catch((responseError) => {
                if (responseError.Message == "Token Bulunamadı!") {
                    this.CreateTokenByRefreshToken();
                }
            })
    }

    DateRangePicker() {
        return (
            <div id="datePickerContainer">
                <Label>Tarihe Göre Filtrele</Label>
                <Form inline id="datePicker">
                    <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                        <Label for="begin">Başlangıç Tarihi</Label>
                        <Input className="ml-2" type="date" id="begin" name="begin" onChange={this.handleChange}></Input>
                    </FormGroup>
                    <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                        <Label for="end">Bitiş Tarihi</Label>
                        <Input className="ml-2" type="date" id="end" name="end" onChange={this.handleChange}></Input>
                    </FormGroup>
                    <Button onClick={this.GetFilteredReportByDateRange.bind(this, this.state.selectedCustomer, this.state.begin, this.state.end)} color="success" className="mr-2">Filtrele</Button>
                    {this.state.dataFiltered != false ? <Button onClick={this.getReport.bind(this, this.state.selectedCustomer)} color="primary">Sıfırla</Button> : null }
                </Form>
            </div>
        );
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
                        <th>Satıl Alma Tarihi</th>
                    </tr>
                </thead>

                <tbody>
                    {this.state.consumedProducts != null ? this.state.consumedProducts.sort((a, b) => a.dateOfUse < b.dateOfUse ? 1 : -1).map((consumedProduct) => (
                        <tr key={consumedProduct.consumedProductId}>
                            <td>{consumedProduct.productCode}</td>
                            <td>{consumedProduct.product}</td>
                            <td>{consumedProduct.quantity}</td>
                            <td>{consumedProduct.unitPrice}</td>
                            <td>{consumedProduct.totalPrice}</td>
                            <td>{consumedProduct.discount}</td>
                            <td>{consumedProduct.dateOfUse.replace('T', ' ').slice(0, -3)}</td>
                        </tr>
                    ))
                        : <h3 className="text-center mt-5">Belirtilen kriterlere göre kayıt bulunamadı!</h3>}
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
                <hr></hr>
                <Row>
                    <Col md={2}>
                        <FormGroup>
                            {this.CustomerSelect(this.state.customers)}
                        </FormGroup>
                    </Col>
                    <Col>
                        {this.DateRangePicker()}
                    </Col>
                </Row>

                <br></br>
                <Row>
                    <Col md="2"></Col>
                    <Col md="4"><h3>Toplam Servis Hizmeti Sayısı: {this.state.reportDetails != null ? this.state.reportDetails.totalQuantityOfReceivedProcesses : 0}</h3></Col>

                    <Col md="4"><h3>Ödediği Toplam Ücret: {this.state.reportDetails != null ? this.state.reportDetails.overallCharge : 0}</h3></Col>

                </Row>

                <hr></hr>
                <h1>Satın Aldığı Ürünler </h1>
                {this.ListToReport()}
            </div>
        );
    }
}