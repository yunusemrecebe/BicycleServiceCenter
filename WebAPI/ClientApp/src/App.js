import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import Menu from './components/Menu';
import Employees from './components/Employees';
import Login from './components/Login';
import Register from './components/Register';
import Logout from './components/Logout';
import AddEmployee from './components/AddEmployee';
import ProductBrand from './components/Product/ProductBrand';
import ProductBrandUpdate from './components/Product/UpdateProductBrand';
import ProductCategory from './components/Product/ProductCategory';
import ProductCategoryUpdate from './components/Product/UpdateProductCategory';

export default class App extends Component {
  static displayName = App.name;
  state = { 
    selectedBrand: undefined,
    selectedCategory: undefined 
  };

  setProductBrand = async (brand) => {
    await this.setState({ selectedBrand: brand });
  };

  setProductCategory = async (category) => {
    await this.setState({ selectedCategory: category });
  };

  render() {
    return (
      <Layout>
        <Route exact path='/' component={Home} />
        <Route exact path='/personeller' component={Employees} />
        <Route exact path='/personelEkle' component={AddEmployee} />
        <Route exact path='/girisYap' component={Login} />
        <Route exact path='/kayitOl' component={Register} />
        <Route exact path='/cikisYap' component={Logout} />
        <Route exact path='/menu' component={Menu} />

        <Route exact path="/ürünMarkası" render={props => (<ProductBrand {...props} setProductBrand={this.setProductBrand}/>)}/>
        <Route exact path="/ÜrünMarkasıGüncelle" render={props => (<ProductBrandUpdate {...props} getProductBrand={this.state.selectedBrand}/>)}/>

        <Route exact path="/ürünKategorisi" render={props => (<ProductCategory {...props} setProductCategory={this.setProductCategory}/>)}/>
        <Route exact path="/ÜrünKategorisiGüncelle" render={props => (<ProductCategoryUpdate {...props} getProductCategory={this.state.selectedCategory}/>)}/>
      </Layout>
    );
  }
}
