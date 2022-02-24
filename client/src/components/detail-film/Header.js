import React, { Fragment } from 'react';
import { Col } from 'react-bootstrap';
import Button from '../Button';

export default function Header({ title }) {
  return (
    <Fragment>
      <Col md={10} className="d-flex justify-content-between align-items-center">
        <h1 className="title text-white fw-bold me-2">{title}</h1>
      </Col>
      <Col className="d-flex justify-content-between align-items-center">
        <Button className="btn-primary my-4">Buy now</Button>
      </Col>
    </Fragment>
  );
}
