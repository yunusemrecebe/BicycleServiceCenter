import React, { Component } from "react";
import { ListGroup, ListGroupItem, Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from "reactstrap";
import { Link } from 'react-router-dom';

export default class Menu extends Component {
    state = {
        categories: [
            [1, "Anasayfa", "/"],
            [2, "Personel", "/personeller"],
            [3, "Personel Ekle", "/personelEkle"],
            [4, "Giriş Yap", "/girisYap"],
            [5, "Kayıt Ol", "/kayitOl"],
            [6, "Çıkış Yap", "/cikisYap"]
        ],
        collapsed: true,
        currentCategory: 0
    };

    toggleNavbar(event) {
        event.preventDefault();
        this.setState({
            collapsed: !this.state.collapsed
        });
    }

    render() {
        return (
            <div>
                <ListGroup>
                    {this.state.categories.map(category => (
                        <ListGroupItem key={category[0]} active={category[0] == this.state.currentCategory?true:false}>
                            <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" light>
                                <NavbarToggler onClick={this.toggleNavbar } className="mr-2" />
                                    <ul className="navbar-nav flex-grow">
                                        <NavItem>
                                            <NavLink tag={Link} className="text-dark" to={category[2]}>{category[1]}</NavLink>
                                        </NavItem>
                                    </ul>
                               
                            </Navbar>
                        </ListGroupItem>
                    ))}
                </ListGroup>
            </div>
        );
    }
}
