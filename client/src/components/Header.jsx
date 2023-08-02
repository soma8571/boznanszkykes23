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
            <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                  Termék
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem>
                    <NavItem>
                      <NavLink 
                        href="/termekek/" 
                        style={{color: "black"}}>
                          Termékek
                      </NavLink>
                    </NavItem>
                  </DropdownItem>
                  <DropdownItem>
                    <NavItem>
                      <NavLink 
                        href="/uj-termek/"
                        style={{color: "black"}}>
                          Új termék
                      </NavLink>
                    </NavItem>
                  </DropdownItem>  
                </DropdownMenu>
              </UncontrolledDropdown>

              <NavItem>
                <NavLink href="/megrendelesek/">Megrendelések</NavLink>
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
              
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                  Egyéb
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem>
                    <NavItem>
                      <NavLink 
                        href="/kiszallitas/" 
                        style={{color: "black"}}>
                          Kiszállítás
                      </NavLink>
                    </NavItem>
                  </DropdownItem>
                  <DropdownItem>
                    <NavItem>
                      <NavLink 
                        href="/galeria/"
                        style={{color: "black"}}>
                          Galéria
                      </NavLink>
                    </NavItem>
                  </DropdownItem>
                  <DropdownItem>
                    <NavItem>
                      <NavLink 
                        href="/keszlet/"
                        style={{color: "black"}}>
                          Készlet
                      </NavLink>
                    </NavItem>
                  </DropdownItem>
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
