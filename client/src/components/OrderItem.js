import React from 'react';
import { Card } from 'react-bootstrap';
import convertRupiah from 'rupiah-format';

const formatedPrice = (price) => {
  return convertRupiah.convert(price.split(',')[1]);
};

export default function OrderItem(props) {
  const { price, status, date, name } = props?.data;

  return (
    <Card className="order-item mt-3">
      <Card.Body>
        <Card.Text>
          <h4 className="mb-3 fw-bold">{name}</h4>
          <p>
            <strong>Saturday</strong>, 12 April 2021
            {date}
          </p>
          <div className="d-flex justify-content-between align-items-center">
            <p className="text-mega fw-bold mb-0 pb-0" style={{ fontSize: 16 }}>
              {formatedPrice(price)}
            </p>
            <div className={`rounded-2 py-1 text-center ${status.toLowerCase()}`}>{status}</div>
          </div>
        </Card.Text>
      </Card.Body>
    </Card>
  );
}
