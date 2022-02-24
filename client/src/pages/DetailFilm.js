import React, { Fragment, useEffect, lazy, Suspense } from 'react';
import Navbar from '../components/Navbar';
import { useQuery } from 'react-query';
import { useUserContext } from '../context/userContext';
import { Col, Container, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { API } from '../config';

const Header = lazy(() => import('../components/detail-film/Header'));
const Description = lazy(() => import('../components/detail-film/Description'));
const ThumbnailFilm = lazy(() => import('../components/detail-film/Thumbnail'));

const api = API();

const checkAuth = (isLogin) => {
  if (isLogin) {
    return { Authorization: 'Bearer ' + localStorage.token };
  }
  return { 'Content-Type': 'application/json' };
};

const getEndpoint = (isLogin, filmId) => {
  if (isLogin) {
    return `/film/${filmId}`;
  }
  return `/g/film/${filmId}`;
};

const getFilm = async (filmId, { isLogin }) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  config.headers = checkAuth(isLogin);
  const endpoint = getEndpoint(isLogin, filmId);

  const response = await api.get(endpoint, config);
  return response?.data;
};

const capitalizeText = (value) => {
  let title = value.split('-');

  const capTitle = title.map((str) => str.charAt(0).toUpperCase() + str.slice(1));
  return capTitle.join(' ');
};

export default function DetailFilm() {
  const { title } = useParams();
  document.title = 'Online Cinema | ' + capitalizeText(title);

  const [state] = useUserContext();

  const { data, isSuccess, refetch, remove } = useQuery('detailFilmCache', () => getFilm(localStorage?.filmId, state));

  useEffect(() => {
    refetch();
    return () => remove();
  }, [state]);

  return (
    <Fragment>
      <Navbar />
      <Suspense>
        <Container>
          {isSuccess && (
            <Row>
              <ThumbnailFilm data={data} />
              <Col md={8} className="p-0">
                <Row className="film mb-4 g-4">
                  <Header title={data.title} />
                  <img src={data?.banner} alt="film" style={{ objectFit: 'cover', height: 300, borderRadius: 20 }} />
                </Row>
                <Description data={data} />
              </Col>
            </Row>
          )}
        </Container>
      </Suspense>
    </Fragment>
  );
}
