import React, { useState } from "react";
import { useRouter } from "next/router";
import {
  Button,
  Container,
  Nav,
  Navbar,
  Form,
  NavDropdown,
} from "react-bootstrap";
import Link from "next/link";
import { useAtom } from "jotai";
import { searchHistoryAtom } from "@/store";
import { addToHistory } from "@/lib/userData";
import { readToken, removeToken } from "@/lib/authenticate";

export default function MainNav() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
  const token = readToken();

  const NavItem = ({ href, children }) => (
    <Link href={href} passHref legacyBehavior>
      <Nav.Link
        active={router.pathname === href}
        onClick={() => setIsExpanded(false)}
      >
        {children}
      </Nav.Link>
    </Link>
  );

  const DropdownItem = ({ href, children, onClick }) => (
    <Link href={href} passHref legacyBehavior>
      <NavDropdown.Item onClick={onClick || (() => setIsExpanded(false))}>
        {children}
      </NavDropdown.Item>
    </Link>
  );

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  async function handleSubmit(event) {
    event.preventDefault();
    let queryString = `title=true&q=${searchValue}`;
    setSearchHistory(await addToHistory(queryString));
    router.push(`/artwork?${queryString}`);
  }

  return (
    <>
      <Navbar
        expand="lg"
        expanded={isExpanded}
        className="fixed-top navbar-dark bg-secondary"
      >
        <Container>
          <Navbar.Brand>Daiki Nagashima</Navbar.Brand>
          <Navbar.Toggle
            onClick={() => setIsExpanded(!isExpanded)}
            aria-controls="basic-navbar-nav"
          />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
              navbarScroll
            >
              <NavItem href="/">Home</NavItem>
              {token && <NavItem href="/search">Advanced Search</NavItem>}
            </Nav>
            {token && (
              <Form className="d-flex" onSubmit={handleSubmit}>
                <Form.Control
                  type="search"
                  placeholder="Search"
                  className="me-2"
                  aria-label="Search"
                  value={searchValue}
                  onChange={handleSearchChange}
                />
                <Button variant="success" type="submit">
                  Search
                </Button>
              </Form>
            )}
            <Nav>
              {token ? (
                <NavDropdown title={token.userName} id="basic-nav-dropdown">
                  <DropdownItem href="/favourites">Favourites</DropdownItem>
                  <DropdownItem href="/history">Search History</DropdownItem>
                  <NavDropdown.Item
                    onClick={() => {
                      setIsExpanded(false);
                      removeToken();
                      router.push("/");
                    }}
                  >
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <>
                  <NavItem href="/login">Login</NavItem>
                  <NavItem href="/register">Register</NavItem>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <br /> <br />
    </>
  );
}
