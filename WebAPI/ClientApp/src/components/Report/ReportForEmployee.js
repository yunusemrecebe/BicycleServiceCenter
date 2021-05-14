import React, { Component } from 'react';
import { Table, Row, Col, Form, FormGroup, Label, Button, Input } from "reactstrap";
import Select from 'react-select';
import '../../css/date.css'

export default class ReportForCustomer extends Component {
    state = {
        reportDetails: [],
        employees: [],
        selectedEmployee: 0,
        begin: null,
        end: null
    }

    componentDidMount() {
        this.getEmployees();
    }

    handleChangeEmployee = (event) => {
        this.state.selectedEmployee = event.value;
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
                this.state.reportDetails = null;
                this.setState({ reportDetails: result.data });

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

                if (!response.ok) {
                    const error = data;
                    return Promise.reject(error);
                }

                if(data.data[0] == null){
                    this.setState({ reportDetails: null });    
                }
                else{
                    this.setState({ reportDetails: data.data, begin:null, end:null });
                    Array.from(document.querySelectorAll("input")).forEach((input) => (input.value = ""));
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
                    <Button onClick={this.GetFilteredReportByDateRange.bind(this,this.state.selectedEmployee,this.state.begin,this.state.end)} color="success">Filtrele</Button>
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
                        <th>Verdiği Servis Hizmeti Sayısı</th>
                    </tr>
                </thead>

                <tbody>
                    {this.state.reportDetails!= null ? this.state.reportDetails.map((reportDetail) => (
                        
                        <tr key={reportDetail.employeeId}>
                            <td>{reportDetail.employee}</td>
                            <td>{reportDetail.totalQuantityOfHandledService}</td>
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
                <Row>
                    <Col md={2}>
                        <FormGroup>
                            {this.EmployeeSelect(this.state.employees)}
                        </FormGroup>
                    </Col>
                    {this.DateRangePicker()}
                </Row>

                <hr></hr>
                <h1>Satın Aldığı Ürünler </h1>
                <br></br>
                {this.ListToReport()}
            </div>
        );
    }
}