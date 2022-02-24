import React from 'react';
import { Col } from 'react-bootstrap';

export default function ThumbnailFilm({ data }) {
  const { thumbnail, title } = data;
  return (
    <Col md={4} className="p-0 rounded-3">
      <img src={thumbnail} alt={`thumbnail - ${title.split(' ').join('-')}`} className="thumbnail" />
    </Col>
  );
}
