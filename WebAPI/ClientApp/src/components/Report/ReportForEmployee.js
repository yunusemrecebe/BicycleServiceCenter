import React, { Component } from 'react';
import { Table, Row, Col, FormGroup, Label } from "reactstrap";
import Select from 'react-select';

export default  class ReportForCustomer extends Component {
    state = {
        reportDetails: [],
    }

    componentDidMount(){
        this.getReport();
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

    //Personeller ile ilgili raporu db'den çekme
    getReport() {
        let token = localStorage.getItem('token');

        let url = "/api/reports/GetReportForEmployeeList";
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

    render() {
        return (
            <div>
                <center><h1> Personeller Hakkında Rapor Oluşturma</h1></center>
                <br></br>
                {this.ListToReport()}
            </div>
        );
    }
}