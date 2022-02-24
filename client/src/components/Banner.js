import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Button from './Button';
import { useUserContext } from '../context/userContext';
import { useNavigate } from 'react-router-dom';
import converRupiah from 'rupiah-format';

const convertFilmName = (name) => {
  return name.toLowerCase().split(' ').join('-');
};

export default function Banner({ buy, setBuy, data }) {
  const [state] = useUserContext();
  const navigate = useNavigate();
  const { id, title, price, banner, description, category } = data;

  const buyFilm = () => {
    if (!state.isLogin) {
      setBuy(true);
    }
    const filmName = convertFilmName(title);
    localStorage.setItem('filmId', id);
    navigate(`/film/${filmName}`);
  };

  const formatedPrice = converRupiah.convert(price).split(',')[0];
  return (
    <Container className="mb-5 d-flex justify-content-center align-items-center">
      <Row
        style={{
          width: '85%',
          minHeight: '447px',
        }}
      >
        <Col>
          <div
            className="banner d-flex justify-content-center align-items-center"
            style={{
              backgroundImage: `url(${banner})`,
              width: '100%',
              minHeight: '100%',
            }}
          >
            <div className="banner-filter"></div>
            <div className="banner-contents">
              <h1 className="banner-title fw-bold">DEAD POOL</h1>
              <h5 className="fw-bold text-white">{category}</h5>
              <h5 className="fw-bold text-mega mb-3">{formatedPrice}</h5>
              <p className="banner-description text-white">{description}</p>
              <Button className="btn-primary" onClick={() => buyFilm()}>
                Buy Now
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
