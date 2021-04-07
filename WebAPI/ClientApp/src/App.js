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




export default class App extends Component {
  static displayName = App.name;

  render () {
    return (
      <Layout>
        <Route exact path='/' component={Home} />
        <Route exact path='/personeller' component={Employees} />
        <Route exact path='/personelEkle' component={AddEmployee} />
        <Route exact path='/girisYap' component={Login} />
        <Route exact path='/kayitOl' component={Register} />
        <Route exact path='/cikisYap' component={Logout} />
        <Route exact path='/menu' component={Menu}/>
        <Route exact path='/ürünMarkası' component={ProductBrand} />
      </Layout>
    );
  }
}
