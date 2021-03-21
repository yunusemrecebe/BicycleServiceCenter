import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import Employees from './components/Employees';

import './custom.css'
import AddEmployee from './components/AddEmployee';

export default class App extends Component {
  // static displayName = App.name;

  render () {
    return (
      <Layout>
        <Route exact path='/' component={Home} />
        <Route exact path='/employees' component={Employees} />
        <Route exact path='/addEmployee' component={AddEmployee} />
      </Layout>
    );
  }
}
