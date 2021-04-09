import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import Employees from './components/Employee/Employees';
import EmployeeUpdate from './components/Employee/UpdateEmployee';
// import Login from './components/Login';
// import Register from './components/Register';
// import Logout from './components/Logout';
// import AddEmployee from './components/Employee/AddEmployee';
import Products from './components/Product/Product';
import ProductUpdate from './components/Product/UpdateProduct';
import ProductBrand from './components/Product/ProductBrand';
import ProductBrandUpdate from './components/Product/UpdateProductBrand';
import ProductCategory from './components/Product/ProductCategory';
import ProductCategoryUpdate from './components/Product/UpdateProductCategory';

export default class App extends Component {
  static displayName = App.name;
  state = { 
    selectedBrand: undefined,
    selectedCategory: undefined,
    selectedProduct: undefined,
    selectedEmployee: undefined,
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

  setEmployee = async (employee) => {
    await this.setState({ selectedEmployee: employee });
  };

  render() {
    return (
      <Layout>
        <Route exact path='/' component={Home} />

        <Route exact path="/ürünMarkası" render={props => (<ProductBrand {...props} setProductBrand={this.setProductBrand}/>)}/>
        <Route exact path="/ÜrünMarkasıGüncelle" render={props => (<ProductBrandUpdate {...props} getProductBrand={this.state.selectedBrand}/>)}/>

        <Route exact path="/ürünKategorisi" render={props => (<ProductCategory {...props} setProductCategory={this.setProductCategory}/>)}/>
        <Route exact path="/ÜrünKategorisiGüncelle" render={props => (<ProductCategoryUpdate {...props} getProductCategory={this.state.selectedCategory}/>)}/>

        <Route exact path="/ürünler" render={props => (<Products {...props} setProduct={this.setProduct}/>)}/>
        <Route exact path="/ÜrünGüncelle" render={props => (<ProductUpdate {...props} getProduct={this.state.selectedProduct}/>)}/>

        <Route exact path="/personeller" render={props => (<Employees {...props} setEmployee={this.setEmployee}/>)}/>
        <Route exact path="/personelGüncelle" render={props => (<EmployeeUpdate {...props} getEmployee={this.state.selectedEmployee}/>)}/>

      </Layout>
    );
  }
}
