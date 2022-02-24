import React from 'react';
import { Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useUserContext } from '../context/userContext';

const checkUser = (contex, filmId) => {
  const [state, dispatch] = contex;

  if (state.isLogin) {
    return dispatch({ type: 'DETAIL_FILM', payload: { filmId } });
  }

  dispatch({ type: 'GENERAL_USER', payload: { filmId } });
};

const convertFilmName = (name) => {
  return name.toLowerCase().split(' ').join('-');
};

export default function FilmItem({ data }) {
  const { id, title, thumbnail } = data;
  const contex = useUserContext();
  const filmName = convertFilmName(title);

  return (
    <Col className="mb-4 py-2" style={{ height: 295 }} key={id}>
      <Link to={'/film/' + filmName}>
        <img src={thumbnail} alt={filmName} className="poster" onClick={() => checkUser(contex, id)} />
      </Link>
    </Col>
  );
}
