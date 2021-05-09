import React, { Component } from "react";
import { Button, Form, Table, Input } from "reactstrap";

export default class Customers extends Component {
    state = {
        firstName: "",
        lastName: "",
        phone: "",
        eMail: null,
        adress: null,  
    };

    handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        this.setState({ [name]: value });
    };

    componentDidUpdate(){
        if(this.props.result == true){
            this.props.history.push("/musteri/listele");
        };
    }

    sendData = (event) => {
        event.preventDefault();
        this.props.addCustomer(this.state.firstName, this.state.lastName, this.state.phone, this.state.eMail, this.state.adress);
    }

    render() {
        return (
            <Form onSubmit={this.sendData}>
                <center><h1>Müşteri Ekle</h1></center>
                <Table borderless>
                    <thead>
                        <tr>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope="row">Adı</th>

                            <td>
                            <Input type="text" name="firstName" id="firstName" onChange={this.handleChange} />
                            </td>
                        </tr>

                        <tr>
                            <th scope="row">Soyadı</th>

                            <td>
                            <Input type="text" name="lastName" id="lastName" onChange={this.handleChange} />
                            </td>
                        </tr>

                        <tr>
                            <th scope="row">Telefon</th>

                            <td>
                            <Input type="text" name="phone" id="phone" onChange={this.handleChange} />
                            </td>
                        </tr>

                        <tr>
                            <th scope="row">Email</th>

                            <td>
                            <Input type="email" name="eMail" id="eMail" onChange={this.handleChange} />
                            </td>
                        </tr>

                        <tr>
                            <th>Adres</th>

                            <td>
                            <Input type="adress" name="adress" id="adress" onChange={this.handleChange} />
                            </td>
                        </tr>

                    </tbody>
                </Table>

                <Button>Ekle</Button>
            </Form>
        );
    }
}
