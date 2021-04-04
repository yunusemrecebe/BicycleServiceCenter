import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import Employees from './components/Employees';
import Login from './components/Login';
import Register from './components/Register';
import AddEmployee from './components/AddEmployee';

import './custom.css'


export default class App extends Component {
  // static displayName = App.name;

  render () {
    return (
      <Layout>
        <Route exact path='/' component={Home} />
        <Route exact path='/employees' component={Employees} />
        <Route exact path='/addEmployee' component={AddEmployee} />
        <Route exact path='/login' component={Login} />
        <Route exact path='/register' component={Register} />
      </Layout>
    );
  }
}
