import React, { Fragment } from 'react';
import { Col } from 'react-bootstrap';
import Films from '../components/Films';
import Navbar from '../components/Navbar';
import { API } from '../config';
import OrderNotFound from '../assets/no-order.svg';
import Order404 from '../components/Order404';

const api = API();

const getFilm = async () => {
  const config = {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + localStorage.token,
    },
  };

  const response = await api.get('/u/films', config);
  return response?.data;
};

export default function UserFilms() {
  document.title = 'Online Cinema | My Films';
  return (
    <Fragment>
      <Navbar />
      <Films title="My List Film" />
      <Order404 className="w-50 mx-auto mt-5" />
    </Fragment>
  );
}
