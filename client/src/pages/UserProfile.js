import React, { Fragment } from 'react';
import { Container, Row } from 'react-bootstrap';
import Navbar from '../components/Navbar';
import Orders from '../components/Orders';
import Profile from '../components/ProfileDetail';

export default function UserProfile() {
  document.title = 'Online Cinema | Profile';
  return (
    <Fragment>
      <Navbar />
      <Container>
        <Row>
          <Profile />
          <Orders />
        </Row>
      </Container>
    </Fragment>
  );
}
