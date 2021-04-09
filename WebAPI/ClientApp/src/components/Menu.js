import React, { Component } from "react";
import { ListGroup, ListGroupItem, Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from "reactstrap";
import { Link } from 'react-router-dom';

export default class Menu extends Component {
    state = {
        categories: [
            [1, "Anasayfa", "/"],
            [2, "Ürün Markası", "/ürünMarkası"],
            [3, "Ürün Kategorisi", "/ürünKategorisi"],
            [4, "Ürünler", "/ürünler"],
            [5, "Personeller", "/personeller"]
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
                        <ListGroupItem key={category[0]} active={category[0] == this.state.currentCategory?true:false} >
                            <ul>
                                <li>
                                <NavItem>
                                            <NavLink tag={Link} className="text-dark" to={category[2]}>{category[1]} </NavLink>
                                        </NavItem>
                                </li>
                            </ul>
                                        
                        </ListGroupItem>
                    ))}
                </ListGroup>
            </div>
        );
    }
}
