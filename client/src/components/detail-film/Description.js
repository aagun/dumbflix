import React from 'react';
import { Row } from 'react-bootstrap';
import converRupiah from 'rupiah-format';

export default function Description(props) {
  const { category, price, description } = props.data;
  const formatedPrice = converRupiah.convert(price).split(',')[0];

  return (
    <Row className="film-content">
      <h4 className="fw-bold text-muted mb-3">{category.name}</h4>
      <p className="price fw-bold text-mega mb-4">{formatedPrice}</p>
      <p className="description text-white fw-light">{description}</p>
    </Row>
  );
}
