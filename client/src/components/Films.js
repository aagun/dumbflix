import React, { lazy, Suspense } from 'react';
import { Container, Row } from 'react-bootstrap';

const FilmItem = lazy(() => import('./FilmItem'));

export default function Films({ title, data }) {
  return (
    <Container>
      <h5 className="fw-bold text-white mb-4">{title}</h5>
      <Suspense>
        <Row className="d-flex flex-wrap row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-6">
          {data?.map((film, index) => (
            <FilmItem data={film} key={index} />
          ))}
        </Row>
      </Suspense>
    </Container>
  );
}
