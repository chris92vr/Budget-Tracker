'use client';

import Link from 'next/link';
import styles from '@/styles/Header.module.css';
import Button from 'react-bootstrap/Button';
import LogoutButton from './LogoutButton';
import { Navbar, Container, Nav, Col } from 'react-bootstrap';
import { Row } from 'react-bootstrap';

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
            <Row>
              <Col>
                <Nav>
                  <Link href="/about">
                    <p>About</p>
                  </Link>
                </Nav>
              </Col>
              <Col>
                <Nav>
                  <Link href="/budgets">
                    <p>Budgets</p>
                  </Link>
                </Nav>
              </Col>
              <Col>
                <Nav>
                  <Link href="/transactions">
                    <p>Transactions</p>
                  </Link>
                </Nav>
              </Col>
              <Col>
                <LogoutButton />
              </Col>
            </Row>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}
