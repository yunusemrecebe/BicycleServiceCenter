import React, { Component } from 'react';
import { Table, Row, Col, Form, FormGroup, Label, Button, Input } from "reactstrap";
import Select from 'react-select';
import '../../css/date.css'

export default class ReportForCustomer extends Component {
    state = {
        reportDetails: [],
        employees: [],
        selectedEmployee: 0,
        totalQuantityOfHandledService: 0,
        totalChargeOfHandledServices: 0,
        dataFiltered: false,
        begin: null,
        end: null
    }

    componentDidMount() {
        this.getEmployees();
    }

    handleChangeEmployee = (event) => {
        this.state.selectedEmployee = event.value;
        this.setState({reportDetails: []});
        this.getReport(this.state.selectedEmployee);
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
            .catch((responseError) => {
                if (responseError.Message == "Token Bulunamadı!") {
                    this.CreateTokenByRefreshToken();
                }
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

                this.setState({ reportDetails: result.data, totalQuantityOfHandledService: result.data[0].totalQuantityOfHandledService, totalChargeOfHandledServices: result.data[0].totalChargeOfHandledServices, begin: null, end: null, dataFiltered: false });
                Array.from(document.querySelectorAll("input")).forEach((input) => (input.value = ""));

            })
            .catch((responseError) => {
                if (responseError.Message == "Token Bulunamadı!") {
                    this.CreateTokenByRefreshToken();
                }
            })
    }

    GetFilteredReportByDateRange(id, begin, end) {
        let token = localStorage.getItem('token');

        let url = "/api/reports/GetFilteredReportForEmployeeByDateRange?employeeId=" + id + "&begin=" + begin + "&end=" + end;
        fetch(url, {
            method: 'get',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(async (response) => {
                const data = await response.json();
                console.log(data);
                if (!response.ok) {
                    const error = data;
                    return Promise.reject(error);
                }

                if (data.data[0] == null) {
                    this.setState({ reportDetails: null, totalQuantityOfHandledService: 0, totalChargeOfHandledServices: 0, dataFiltered: true });
                }
                else {
                    this.setState({ reportDetails: data.data,  totalQuantityOfHandledService: data.data[0].totalQuantityOfHandledService, totalChargeOfHandledServices: data.data[0].totalChargeOfHandledServices, dataFiltered: true });
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
                    <Button onClick={this.GetFilteredReportByDateRange.bind(this, this.state.selectedEmployee, this.state.begin, this.state.end)} color="success" className="mr-2">Filtrele</Button>
                    {this.state.dataFiltered != false ? <Button onClick={this.getReport.bind(this, this.state.selectedEmployee)} color="primary">Sıfırla</Button> : null }
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
                        <th>Personel</th>
                        <th>Hizmet Verdiği Müşteri</th>
                        <th>Verdiği Servis Hizmetinin Ücreti</th>
                        <th>Verdiği Servis Hizmetinin Tarihi</th>
                    </tr>
                </thead>

                <tbody>
                    {this.state.reportDetails != null ? this.state.reportDetails.sort((a, b) => a.dateOfProcess < b.dateOfProcess ? 1 : -1).map((reportDetail) => (

                        <tr key={reportDetail.employeeId}>
                            <td>{reportDetail.employee}</td>
                            <td>{reportDetail.servedCustomer}</td>
                            <td>{reportDetail.chargeOfHandledService}</td>
                            <td>{reportDetail.dateOfProcess.replace('T', ' ').slice(0, -3)}</td>
                        </tr>
                    ))
                        : <h3 className="text-center mt-5">Belirtilen kriterlere göre kayıt bulunamadı!</h3>}
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
                <hr></hr>
                <Row>
                    <Col md={2}>
                        <FormGroup>
                            {this.EmployeeSelect(this.state.employees)}
                        </FormGroup>
                    </Col>
                    <Col>
                        {this.DateRangePicker()}
                    </Col>
                </Row>
                <br></br>
                <Row>
                    <Col md="1"></Col>
                    <Col md="4"><h3>Verdiği Servis Hizmeti Sayısı: {this.state.totalQuantityOfHandledService}</h3></Col>
                    <Col md="7"><h3>Verdiği Servis Hizmetlerinin Toplam Ücreti: {this.state.totalChargeOfHandledServices}</h3></Col>
                </Row>
                <hr></hr>
                <h1>Verdiği Servis Hizmetleri </h1>
                <br></br>
                {this.ListToReport()}
            </div>
        );
    }
}