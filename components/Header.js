'use client';

import Link from 'next/link';
import styles from '@/styles/Header.module.css';
import LogoutButton from './LogoutButton';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { isUserLoggedIn } from '../app/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faSignInAlt,
  faUserPlus,
  faSignOut,
} from '@fortawesome/free-solid-svg-icons';

export default function Header() {
  return (
    <header className={styles.header}>
      <Navbar expand="lg">
        <Container>
          <Navbar.Brand>
            <Link href="/">Budget Tracker</Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Link href="/user">
                <FontAwesomeIcon icon={faUser} /> Profile
              </Link>
            </Nav>
            <Nav>
              {isUserLoggedIn() ? (
                <Nav.Item>
                  <LogoutButton>
                    <FontAwesomeIcon icon={faSignOut} /> Logout
                  </LogoutButton>
                </Nav.Item>
              ) : (
                <>
                  <Nav.Item>
                    <Link href="/login">
                      <FontAwesomeIcon icon={faSignInAlt} /> Login
                    </Link>
                    <Link href="/register">
                      <FontAwesomeIcon icon={faUserPlus} /> Register
                    </Link>
                  </Nav.Item>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}
