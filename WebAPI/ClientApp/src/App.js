import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import Employees from './components/Employee/Employees';
import EmployeeUpdate from './components/Employee/UpdateEmployee';
import Customers from './components/Customer/Customers';
import CustomerAdd from './components/Customer/AddCustomer';
import CustomerUpdate from './components/Customer/UpdateCustomer';
import Products from './components/Product/Product';
import ProductAdd from './components/Product/AddProduct';
import ProductUpdate from './components/Product/UpdateProduct';
import ProductBrand from './components/Product/ProductBrand';
import ProductBrandUpdate from './components/Product/UpdateProductBrand';
import ProductCategory from './components/Product/ProductCategory';
import ProductCategoryUpdate from './components/Product/UpdateProductCategory';
import BicycleBrand from './components/Bicycle/BiycyleBrand';
import BicycleBrandAdd from './components/Bicycle/AddBicycleBrand';
import BicycleBrandUpdate from './components/Bicycle/UpdateBicycleBrand';
import BicycleModel from './components/Bicycle/BicycleModel';
import BicycleModelAdd from './components/Bicycle/AddBicycleModel';
import BicycleModelUpdate from './components/Bicycle/UpdateBicycleModel';
import Bicycle from './components/Bicycle/Bicycle';
import BicycleAdd from './components/Bicycle/AddBicycle';
import BicycleUpdate from './components/Bicycle/UpdateBicycle';
import Process from './components/Process/Process';
import ProcessAdd from './components/Process/AddProcess';
import ProcessUpdate from './components/Process/UpdateProcess';
import Inventory from './components/Inventory/Inventory';
import InventoryUpdate from './components/Inventory/UpdateInventory';
import ConsumedProductUpdate from "./components/ConsumedProduct/UpdateConsumedProduct";
import Login from "./components/Authentication/Login";
import Logout from "./components/Authentication/Logout";
import Register from "./components/Authentication/Register";
import ReportForCustomer from "./components/Report/ReportForCustomer";
import ReportForEmployee from "./components/Report/ReportForEmployee";
import ReportForProduct from "./components/Report/ReportForProduct";
import Navbar from "./components/NavBar";
import AddProductBrand from './components/Product/AddProductBrand';
import AddProductCategory from './components/Product/AddProductCategory';
import AddEmployee from './components/Employee/AddEmployee';


let result = false;

export default class App extends Component {
  static displayName = App.name;

  state = {
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
    consumedProduct: undefined,
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
    await this.setState({ selectedProcessCustomer: customer });
  };

  setConsumedProduct = async (consumedProduct) => {
    await this.setState({ consumedProduct: consumedProduct });
  };

  render() {
    return (
      <Layout>
        <Route exact path='/navbar' component={Navbar} />

        <Route exact path='/' component={Home} />
        <Route exact path="/kullanici/giris" render={props => (<Login {...props} setAuth={this.setAuth} />)} />
        <Route exact path="/kullanici/cikis" render={props => (<Logout {...props} setAuth={this.setAuth} />)} />
        <Route exact path='/kullanici/kayit' component={Register} />

        {/* PRODUCT İLE İLGİLİ YÖNLENDİRMELER */}
        <Route exact path="/urun/ekle" render={props => (<ProductAdd {...props} />)} />
        <Route exact path="/urun/listele" render={props => (<Products {...props} setProduct={this.setProduct} />)} />
        <Route exact path="/urun/guncelle" render={props => (<ProductUpdate {...props} getProduct={this.state.selectedProduct} />)} />
        <Route exact path="/urun/marka/ekle" render={props => (<AddProductBrand {...props} />)} />
        <Route exact path="/urun/marka/listele" render={props => (<ProductBrand {...props} setProductBrand={this.setProductBrand} />)} />
        <Route exact path="/urun/marka/guncelle" render={props => (<ProductBrandUpdate {...props} getProductBrand={this.state.selectedBrand} />)} />
        <Route exact path="/urun/kategori/ekle" render={props => (<AddProductCategory {...props} />)} />
        <Route exact path="/urun/kategori/listele" render={props => (<ProductCategory {...props} setProductCategory={this.setProductCategory} />)} />
        <Route exact path="/urun/kategori/guncelle" render={props => (<ProductCategoryUpdate {...props} getProductCategory={this.state.selectedCategory} />)} />

        {/* INVENTORY İLE İLGİLİ YÖNLENDİRMELER*/}
        <Route exact path="/stok/listele" render={props => (<Inventory {...props} setInventory={this.setInventory} />)} />
        <Route exact path="/stok/guncelle" render={props => (<InventoryUpdate {...props} getInventory={this.state.selectedInventory} />)} />

        {/* BICYCLE İLE İLGİLİ YÖNLENDİRMELER */}
        <Route exact path="/bisiklet/ekle" render={props => (<BicycleAdd {...props} />)} />
        <Route exact path="/bisiklet/listele" render={props => (<Bicycle {...props} setBicycle={this.setBicycle} />)} />
        <Route exact path="/bisiklet/guncelle" render={props => (<BicycleUpdate {...props} getBicycle={this.state.selectedBicycle} />)} />
        <Route exact path="/bisiklet/marka/ekle" render={props => (<BicycleBrandAdd {...props} />)} />
        <Route exact path="/bisiklet/marka/listele" render={props => (<BicycleBrand {...props} setBicycleBrand={this.setBicycleBrand} />)} />
        <Route exact path="/bisiklet/marka/guncelle" render={props => (<BicycleBrandUpdate {...props} getBicycleBrand={this.state.selectedBicycleBrand} />)} />
        <Route exact path="/bisiklet/model/ekle" render={props => (<BicycleModelAdd {...props} />)} />
        <Route exact path="/bisiklet/model/listele" render={props => (<BicycleModel {...props} setBicycleModel={this.setBicycleModel} />)} />
        <Route exact path="/bisiklet/model/guncelle" render={props => (<BicycleModelUpdate {...props} getBicycleModel={this.state.selectedBicycleModel} />)} />

        {/* PROCESS İLE İLGİLİ YÖNLENDİRMELER */}
        <Route exact path="/servis/listele" render={props => (<Process {...props} setProcess={this.setProcess} setSelectedCustomer={this.setSelectedCustomer} />)} />
        <Route exact path="/servis/ekle" render={props => (<ProcessAdd {...props} />)} />
        <Route exact path="/servis/guncelle" render={props => (<ProcessUpdate {...props} getCustomer={this.state.selectedProcessCustomer} getProcess={this.state.selectedProcess} setConsumedProduct={this.setConsumedProduct} />)} />
        <Route exact path="/servis/guncelle/urun/guncelle" render={props => (<ConsumedProductUpdate {...props} getConsumedProduct={this.state.consumedProduct} />)} />

        {/* EMPLOYEE İLE İLGİLİ YÖNLENDİRMELER */}
        <Route exact path="/personel/ekle" render={props => (<AddEmployee {...props} />)} />
        <Route exact path="/personel/listele" render={props => (<Employees {...props} setEmployee={this.setEmployee} />)} />
        <Route exact path="/personel/guncelle" render={props => (<EmployeeUpdate {...props} getEmployee={this.state.selectedEmployee} />)} />

        {/* CUSTOMER İLE İLGİLİ YÖNLENDİRMELER */}
        <Route exact path="/musteri/listele" render={props => (<Customers {...props} listCustomers={this.state.customers} deleteCustomer={this.deleteCustomer} setCustomer={this.setCustomer} />)} />
        <Route exact path="/musteri/ekle" render={props => (<CustomerAdd {...props} addCustomer={this.addCustomer} result = {result} />)} />
        <Route exact path="/musteri/guncelle" render={props => (<CustomerUpdate {...props} getCustomer={this.state.selectedCustomer} />)} />

        {/* REPORT İLE İLGİLİ YÖNLENDİRMELER */}
        <Route exact path='/rapor/musteri' component={ReportForCustomer} />
        <Route exact path='/rapor/personel' component={ReportForEmployee} />
        <Route exact path='/rapor/urun' component={ReportForProduct} />

      </Layout>
    );
  }
}
