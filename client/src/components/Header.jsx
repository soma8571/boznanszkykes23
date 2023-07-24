import React from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    NavbarText,
    Button,
  } from 'reactstrap';
  import { useCookies } from "react-cookie";


function Header() {

  const [cookie, setCookie, removeCookie] = useCookies(["accessToken"]);

  function logout() {
    //setCookie("accessToken", "");
    removeCookie("accessToken", {path: "/"});
  }

  return (
    <div className='header'>
      <div>
        <Navbar expand="lg" dark={true}>
        <NavbarBrand href="/">Boznánszkykés</NavbarBrand>
          <Collapse isOpen={true} navbar>
            <Nav className="me-auto" navbar>
              <NavItem>
                <NavLink href="/termekek/">Termékek</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/megrendelesek/">Megrendelések</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/keszlet/">Készlet</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/vasarlok/">Vásárlók</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/hirlevel/">Hírlevél</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/felhivas/">Felhívás</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/galeria/">Galéria</NavLink>
              </NavItem>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                  Options
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem>Option 1</DropdownItem>
                  <DropdownItem>Option 2</DropdownItem>
                  <DropdownItem>Reset</DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
      <div>
        <Button onClick={logout} className='btn btn-warning'>Kilépés</Button>
      </div>
    </div>
  )
}

export default Header;
