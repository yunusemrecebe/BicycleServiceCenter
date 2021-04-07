import React, { Component } from "react";
import alertify from "alertifyjs";
import { Redirect } from "react-router";
import {
  Container,
  FormGroup,
  Row,
  Col,
  ListGroup,
  ListGroupItem,
} from "reactstrap";

export default class ProductBrand extends Component {
  state = {
    productBrands: [],
    name: ""
  };

  componentDidMount() {
    this.getProductBrands();
  }

  handleChange = (event) => {
    let name = event.target.name;
    let value = event.target.value;
    this.setState({ [name]: value });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: this.state.name,
      }),
    };

    fetch("/api/productbrands/add", requestOptions)
      .then(async (response) => {
        const data = await response.json();
       
        if (!response.ok) {
          const error = data;
          return Promise.reject(error);
        }
        
        this.getProductBrands();
        Array.from(document.querySelectorAll("input")).forEach((input) => (input.value = ""));
        this.setState({ name: "" });
        alertify.success("Ürün Markası Eklendi!");
      })

      .catch((responseError) => {
        if (responseError.Errors) {
          if (responseError.Errors.length > 0) {
            for (let i = 0; i < responseError.Errors.length; i++) {
              alertify.error(responseError.Errors[i].ErrorMessage);
            }
          }
        }
      });
  };

  getProductBrands() {
    let token = localStorage.getItem('token');
    if (token == null) {
      alert('Bu sayfayı görüntüleyebilmek için giriş yapmalısınız!');
      this.props.history.push("/login")
    }

    let url = "/api/productbrands/getall";
    fetch(url, {
      method: 'get',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((response) => response.json())
      .then((data) => this.setState({ productBrands: data }));
  };

  ListProductBrands() {
    this.getProductBrands();
    return (
      <ListGroup>
        {this.state.productBrands.length > 0 ? this.state.productBrands.map((brand) =>
          (<ListGroupItem key={brand.productBrandId} className="mb-3">{brand.productBrandId  + " " + brand.name}</ListGroupItem>))
          : <h3 className="text-center">Listelenecek Ürün Markası bulunamadı!</h3>
        }
      </ListGroup>
    )
  }

  render() {
    return (
      <div>
          <form onSubmit={this.handleSubmit}>
              <FormGroup>
                  <label htmlFor="productName">Marka Adı</label>
                  <input type="text" id="productName" name="name" onChange={this.handleChange}></input>
                  <button type="submit">Ekle</button>
              </FormGroup>
          </form>

        <Row>
          <h1>Ürün Markaları</h1>
          <Col md="2"></Col>
          <Col md="8">
            {this.ListProductBrands()}
          </Col>
          <Col md="2"></Col>
        </Row>

      </div>
    );
  }
}
