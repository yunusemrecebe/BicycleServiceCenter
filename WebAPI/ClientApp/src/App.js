import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import alertify from "alertifyjs";
import { Home } from './components/Home';
import Employees from './components/Employee/Employees';
import EmployeeUpdate from './components/Employee/UpdateEmployee';
import Customers from './components/Customer/Customers';
import CustomerUpdate from './components/Customer/UpdateCustomer';
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
import Inventory from './components/Inventory/Inventory';
import InventoryUpdate from './components/Inventory/UpdateInventory';
import ConsumedPartUpdate from "./components/ConsumedPart/UpdateConsumedPart";
import Login from "./components/Authentication/Login";
import Logout from "./components/Authentication/Logout";
import Register from "./components/Authentication/Register";
import ReportForCustomer from "./components/Report/ReportForCustomer";
import ReportForEmployee from "./components/Report/ReportForEmployee";
import ReportForProduct from "./components/Report/ReportForProduct";
import Test from "./components/test";

export default class App extends Component {
  static displayName = App.name;
  state = {
    customers: [],
    selectedBrand: undefined,
    selectedCategory: undefined,
    selectedProduct: undefined,
    selectedInventory: undefined,
    selectedBicycleBrand: undefined,
    selectedBicycleModel: undefined,
    selectedBicycle: undefined,
    selectedEmployee: undefined,
    selectedCustomer: undefined,
    selectedProcess: undefined,
    selectedProcessCustomer: undefined,
    consumedPart: undefined,
  };

  componentDidMount() {
    this.getCustomers();
  }

  setAuth = (auth) => {
    this.setState({ isAuthenticated: auth })
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

  setInventory = async (inventory) => {
    await this.setState({ selectedInventory: inventory });
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

  setConsumedPart = async (consumedPart) => {
    await this.setState({
      consumedPart: consumedPart,
    });
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

  //Müşteri Silme
  deleteCustomer = (id) => {

    let token = localStorage.getItem('token');
    if (token == null) {
        alert('Bu işlemi gerçekleştirebilmek için giriş yapmalısınız!');
        this.props.history.push("/girisYap")
    }

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
    };

    fetch("/api/customers/delete?id=" + id, requestOptions)
        .then(async (response) => {
            const data = await response.json();

            if (!response.ok) {
                const error = data;
                alertify.error(data.message);
                return Promise.reject(error);
            }

            this.getCustomers();
            alertify.warning(data.message);
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

  render() {
    return (
      <Layout>
        <Route exact path='/test' component={Test} />

        <Route exact path='/' component={Home} />
        <Route exact path="/girisYap" render={props => (<Login {...props} setAuth={this.setAuth} />)} />
        <Route exact path="/cikisYap" render={props => (<Logout {...props} setAuth={this.setAuth} />)} />
        <Route exact path='/kayitOl' component={Register} />

        {/* PRODUCT İLE İLGİLİ YÖNLENDİRMELER */}
        <Route exact path="/ürünMarkası" render={props => (<ProductBrand {...props} setProductBrand={this.setProductBrand} />)} />
        <Route exact path="/ÜrünMarkasıGüncelle" render={props => (<ProductBrandUpdate {...props} getProductBrand={this.state.selectedBrand} />)} />
        <Route exact path="/ürünKategorisi" render={props => (<ProductCategory {...props} setProductCategory={this.setProductCategory} />)} />
        <Route exact path="/ÜrünKategorisiGüncelle" render={props => (<ProductCategoryUpdate {...props} getProductCategory={this.state.selectedCategory} />)} />
        <Route exact path="/ürünler" render={props => (<Products {...props} setProduct={this.setProduct} />)} />
        <Route exact path="/ÜrünGüncelle" render={props => (<ProductUpdate {...props} getProduct={this.state.selectedProduct} />)} />

        {/* INVENTORY İLE İLGİLİ YÖNLENDİRMELER*/}
        <Route exact path="/envanter" render={props => (<Inventory {...props} setInventory={this.setInventory} />)} />
        <Route exact path="/envanterGüncelle" render={props => (<InventoryUpdate {...props} getInventory={this.state.selectedInventory} />)} />

        {/* BICYCLE İLE İLGİLİ YÖNLENDİRMELER */}
        <Route exact path="/bisikletMarkası" render={props => (<BicycleBrand {...props} setBicycleBrand={this.setBicycleBrand} />)} />
        <Route exact path="/bisikletMarkasıGüncelle" render={props => (<BicycleBrandUpdate {...props} getBicycleBrand={this.state.selectedBicycleBrand} />)} />
        <Route exact path="/bisikletModeli" render={props => (<BicycleModel {...props} setBicycleModel={this.setBicycleModel} />)} />
        <Route exact path="/bisikletModeliGüncelle" render={props => (<BicycleModelUpdate {...props} getBicycleModel={this.state.selectedBicycleModel} />)} />
        <Route exact path="/bisikletler" render={props => (<Bicycle {...props} setBicycle={this.setBicycle} />)} />
        <Route exact path="/bisikletGüncelle" render={props => (<BicycleUpdate {...props} getBicycle={this.state.selectedBicycle} />)} />

        {/* PROCESS İLE İLGİLİ YÖNLENDİRMELER */}
        <Route exact path="/servisHizmeti" render={props => (<Process {...props} setProcess={this.setProcess} setSelectedCustomer={this.setSelectedCustomer} />)} />
        <Route exact path="/servisHizmetiGüncelle" render={props => (<ProcessUpdate {...props} getCustomer={this.state.selectedProcessCustomer} getProcess={this.state.selectedProcess} setConsumedPart={this.setConsumedPart} />)} />
        <Route exact path="/kullanılanÜrünüGüncelle" render={props => (<ConsumedPartUpdate {...props} getConsumedPart={this.state.consumedPart} />)} />

        {/* EMPLOYEE İLE İLGİLİ YÖNLENDİRMELER */}
        <Route exact path="/personeller" render={props => (<Employees {...props} setEmployee={this.setEmployee} />)} />
        <Route exact path="/personelGüncelle" render={props => (<EmployeeUpdate {...props} getEmployee={this.state.selectedEmployee} />)} />

        {/* <GuardedRoute path='/personeller' component={Employees} auth = {this.state.isAuthenticated} setEmployee={this.setEmployee} />
        <GuardedRoute path='/personelGüncelle' component={EmployeeUpdate} auth = {this.state.isAuthenticated} getEmployee={this.state.selectedEmployee} /> */}


        {/* CUSTOMER İLE İLGİLİ YÖNLENDİRMELER */}
        <Route exact path="/musteriler/listele" render={props => (<Customers {...props} setCustomer={this.setCustomer} deleteCustomer={this.deleteCustomer} listCustomers={this.state.customers} />)} />
        <Route exact path="/musteriler/guncelle" render={props => (<CustomerUpdate {...props} getCustomer={this.state.selectedCustomer} />)} />

        {/* REPORT İLE İLGİLİ YÖNLENDİRMELER */}
        <Route exact path='/müşteriRaporu' component={ReportForCustomer} />
        <Route exact path='/personelRaporu' component={ReportForEmployee} />
        <Route exact path='/ürünRaporu' component={ReportForProduct} />

      </Layout>
    );
  }
}
