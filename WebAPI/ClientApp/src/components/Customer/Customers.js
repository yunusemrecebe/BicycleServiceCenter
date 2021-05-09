import React, { Component } from "react";
import { Button, Table, Row, Col } from "reactstrap";

export default class Customers extends Component {

    //Db'Den çekilmiş müşterileri listeleme
    ListCustomers() {
        return (
            <Table hover>
                <thead>
                    <tr>
                        <th>Ad Soyad</th>
                        <th>Telefon</th>
                        <th>EMail</th>
                        <th>Adres</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {this.props.listCustomers.length > 0 ? this.props.listCustomers.map((customer) => (
                        <tr key={customer.customerId}>
                            <td>{customer.firstName} {customer.lastName}</td>
                            <td>{customer.phone}</td>
                            <td>{customer.eMail}</td>
                            <td>{customer.adress}</td>
                            <td><Button onClick={this.props.deleteCustomer.bind(this, customer.customerId)} color="danger">Sil</Button></td>
                            <td><Button onClick={this.updateCustomer.bind(this, customer.customerId)} color="info">Güncelle</Button></td>
                        </tr>
                    ))
                        :
                        <h1>Sistemde kayıtlı müşteri bulunamadı!</h1>
                    }
                </tbody>
            </Table>
        )
    }

    //Müşteri güncellemek için Müşteri İd gönderen fonksiyon
    setCustomer = (id) => {
        this.props.setCustomer(id);
    }

    //Müşteri Güncelleme
    updateCustomer(id) {
        this.setCustomer(id);
        this.props.history.push("/musteri/guncelle");
    };

    render() {
        return (
            <div>
                <center><h1 className="text-center">Sistemde Kayıtlı Olan Müşteriler</h1></center>
                <br></br>
                {this.ListCustomers()}
            </div>
        );
    }
}
