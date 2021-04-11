import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import Employees from './components/Employee/Employees';
import EmployeeUpdate from './components/Employee/UpdateEmployee';
import Customers from './components/Customer/Customers';
import CustomerUpdate from './components/Customer/UpdateCustomer';
// import Login from './components/Login';
// import Register from './components/Register';
// import Logout from './components/Logout';
import Products from './components/Product/Product';
import ProductUpdate from './components/Product/UpdateProduct';
import ProductBrand from './components/Product/ProductBrand';
import ProductBrandUpdate from './components/Product/UpdateProductBrand';
import ProductCategory from './components/Product/ProductCategory';
import ProductCategoryUpdate from './components/Product/UpdateProductCategory';
import BicycleBrand from './components/Bicycle/BiycyleBrand';
import BicycleBrandUpdate from './components/Bicycle/UpdateBicycleBrand';
import BicycleModel from './components/Bicycle/BicycleModel';
import BicycleModelUpdate from './components/Bicycle/UpdateBicycleModel';
import Bicycle from './components/Bicycle/Bicycle';
import BicycleUpdate from './components/Bicycle/UpdateBicycle';
import Process from './components/Process/Process';
import ProcessUpdate from './components/Process/UpdateProcess';

export default class App extends Component {
  static displayName = App.name;
  state = {
    selectedBrand: undefined,
    selectedCategory: undefined,
    selectedProduct: undefined,
    selectedBicycleBrand: undefined,
    selectedBicycleModel: undefined,
    selectedBicycle: undefined,
    selectedEmployee: undefined,
    selectedCustomer: undefined,
    selectedProcess: undefined,
    selectedProcessCustomer: undefined,
  };

  setProductBrand = async (brand) => {
    await this.setState({ selectedBrand: brand });
  };

  setProductCategory = async (category) => {
    await this.setState({ selectedCategory: category });
  };

  setProduct = async (product) => {
    await this.setState({ selectedProduct: product });
  };

  setBicycleBrand = async (brand) => {
    await this.setState({ selectedBicycleBrand: brand });
  };

  setBicycleModel = async (model) => {
    await this.setState({ selectedBicycleModel: model });
  };

  setBicycle = async (bicycle) => {
    await this.setState({ selectedBicycle: bicycle });
  };

  setEmployee = async (employee) => {
    await this.setState({ selectedEmployee: employee });
  };

  setCustomer = async (customer) => {
    await this.setState({ selectedCustomer: customer });
  };

  setProcess = async (process) => {
    await this.setState({ 
      selectedProcess: process,
     });
  };

  setSelectedCustomer = async (customer) => {
    await this.setState({ 
      selectedProcessCustomer: customer
     });
  };


  render() {
    return (
      <Layout>
        <Route exact path='/' component={Home} />

        {/* PRODUCT İLE İLGİLİ YÖNLENDİRMELER */}
        <Route exact path="/ürünMarkası" render={props => (<ProductBrand {...props} setProductBrand={this.setProductBrand} />)} />
        <Route exact path="/ÜrünMarkasıGüncelle" render={props => (<ProductBrandUpdate {...props} getProductBrand={this.state.selectedBrand} />)} />
        <Route exact path="/ürünKategorisi" render={props => (<ProductCategory {...props} setProductCategory={this.setProductCategory} />)} />
        <Route exact path="/ÜrünKategorisiGüncelle" render={props => (<ProductCategoryUpdate {...props} getProductCategory={this.state.selectedCategory} />)} />
        <Route exact path="/ürünler" render={props => (<Products {...props} setProduct={this.setProduct} />)} />
        <Route exact path="/ÜrünGüncelle" render={props => (<ProductUpdate {...props} getProduct={this.state.selectedProduct} />)} />

        {/* BICYCLE İLE İLGİLİ YÖNLENDİRMELER */}
        <Route exact path="/bisikletMarkası" render={props => (<BicycleBrand {...props} setBicycleBrand={this.setBicycleBrand} />)} />
        <Route exact path="/bisikletMarkasıGüncelle" render={props => (<BicycleBrandUpdate {...props} getBicycleBrand={this.state.selectedBicycleBrand} />)} />
        <Route exact path="/bisikletModeli" render={props => (<BicycleModel {...props} setBicycleModel={this.setBicycleModel} />)} />
        <Route exact path="/bisikletModeliGüncelle" render={props => (<BicycleModelUpdate {...props} getBicycleModel={this.state.selectedBicycleModel} />)} />
        <Route exact path="/bisikletler" render={props => (<Bicycle {...props} setBicycle={this.setBicycle} />)} />
        <Route exact path="/bisikletGüncelle" render={props => (<BicycleUpdate {...props} getBicycle={this.state.selectedBicycle} />)} />

        {/* PROCESS İLE İLGİLİ YÖNLENDİRMELER */}
        <Route exact path="/servisHizmeti" render={props => (<Process {...props} setProcess={this.setProcess} setSelectedCustomer={this.setSelectedCustomer} />)} />
        <Route exact path="/servisHizmetiGüncelle" render={props => (<ProcessUpdate {...props} getProcess={this.state.selectedProcess} getCustomer={this.state.selectedProcessCustomer} />)} />

        {/* EMPLOYEE İLE İLGİLİ YÖNLENDİRMELER */}
        <Route exact path="/personeller" render={props => (<Employees {...props} setEmployee={this.setEmployee} />)} />
        <Route exact path="/personelGüncelle" render={props => (<EmployeeUpdate {...props} getEmployee={this.state.selectedEmployee} />)} />

        {/* CUSTOMER İLE İLGİLİ YÖNLENDİRMELER */}
        <Route exact path="/müşteriler" render={props => (<Customers {...props} setCustomer={this.setCustomer} />)} />
        <Route exact path="/müşteriGüncelle" render={props => (<CustomerUpdate {...props} getCustomer={this.state.selectedCustomer} />)} />
      </Layout>
    );
  }
}
