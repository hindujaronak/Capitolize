import React, { Component } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink
 } from 'reactstrap';

  class AppNavbar extends Component {
    state = {
            isOpen: false
        }
    
    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    render() {
        return(
            <div>
                <Navbar color="dark" dark expand="sm" className="mb-5">
                    <NavbarBrand href="/">Capitolize</NavbarBrand>
                    <NavbarToggler onClick ={this.toggle} />
                    <Collapse isOpen= {this.state.isOpen} navbar>
                        <Nav className = "ml-auto" navbar>
                            <NavItem>
                                <NavLink href="https://github.com">Github</NavLink>
                            </NavItem>
                        </Nav> 
                    </Collapse>    
                </Navbar>
            </div>
        );
        
    }

  }

  
  export default AppNavbar