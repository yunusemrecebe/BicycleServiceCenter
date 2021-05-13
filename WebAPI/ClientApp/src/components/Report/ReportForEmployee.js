import React, { Component } from 'react';
import { Table, Row, Col, FormGroup, Label } from "reactstrap";
import Select from 'react-select';

export default class ReportForCustomer extends Component {
    state = {
        reportDetails: [],
        employees: [],
        selectedEmployee: 0
    }

    componentDidMount() {
        this.getEmployees();
    }

    handleChangeEmployee = (event) => {
        this.state.reportDetails = null;
        this.state.selectedEmployee = event.value;
        this.getReport(this.state.selectedEmployee);
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
    getEmployees() {
        let token = localStorage.getItem('token');

        let url = "/api/employees/getall";
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
                this.setState({ employees: data });
            })
    };

    //Personeller ile ilgili raporu db'den çekme
    getReport(id) {
        let token = localStorage.getItem('token');

        let url = "/api/reports/GetReportForEmployee?employeeId=" + id;
        fetch(url, {
            method: 'get',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(async (response) => {
                const result = await response.json();

                if (!response.ok) {
                    const error = result;
                    return Promise.reject(error);
                }

                this.setState({ reportDetails: result.data });

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
                        <th>Personel</th>
                        <th>Verdiği Servis Hizmeti Sayısı</th>
                    </tr>
                </thead>

                <tbody>
                    {this.state.reportDetails.map((reportDetail) => (
                        <tr key={reportDetail.employeeId}>
                            <td>{reportDetail.employee}</td>
                            <td>{reportDetail.totalQuantityOfHandledService}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        )
    }

    EmployeeSelect(dizi = []) {
        let options = [];

        if (dizi.length != options.length) {
            for (let index = 0; index < dizi.length; index++) {
                options.push({ value: dizi[index].employeeId, label: dizi[index].firstName + " " + dizi[index].lastName },)
            };
        }

        return <div>
            <Label for="customerSelect">Personeller</Label>
            <Select
                id="customerSelect"
                placeholder="Seçiniz"
                options={options}
                onChange={this.handleChangeEmployee}
            />
        </div>

    }

    render() {
        return (
            <div>
                <center><h1> Personel Hakkında Rapor Oluşturma</h1></center>
                <Row>
                    <Col md={4}>
                        <FormGroup>
                            {this.EmployeeSelect(this.state.employees)}
                        </FormGroup>
                    </Col>
                </Row>
                <br></br>
                {/* <Row>
                    <Col md="6"><h3>Toplam Birim Satış Miktarı: {this.state.totalQuantityOfSale}</h3></Col>
                    <Col md="6"><h3>Toplam Satış Ücreti: {this.state.totalPriceOfSale}</h3></Col>
                </Row> */}
                <hr></hr>
                <h1>Satın Aldığı Ürünler </h1>
                <br></br>
                {this.ListToReport()}
            </div>
        );
    }
}