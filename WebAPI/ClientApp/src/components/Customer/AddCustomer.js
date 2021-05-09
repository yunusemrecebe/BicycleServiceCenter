import React, { Component } from "react";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";

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
        this.state.data[name] = value;
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
                <br></br>
                <FormGroup>
                    <Label for="firstName">Adı</Label>
                    <Input type="text" name="firstName" id="firstName" onChange={this.handleChange} />
                </FormGroup>

                <FormGroup>
                    <Label for="lastName">Soyadı</Label>
                    <Input type="text" name="lastName" id="lastName" onChange={this.handleChange} />
                </FormGroup>

                <FormGroup>
                    <Label for="phone">Telefon</Label>
                    <Input type="text" name="phone" id="phone" onChange={this.handleChange} />
                </FormGroup>

                <FormGroup>
                    <Label for="eMail">Email</Label>
                    <Input type="email" name="eMail" id="eMail" onChange={this.handleChange} />
                </FormGroup>

                <FormGroup>
                    <Label for="adress">Adres</Label>
                    <Input type="adress" name="adress" id="adress" onChange={this.handleChange} />
                </FormGroup>

                <Button>Ekle</Button>
            </Form>
        );
    }
}
