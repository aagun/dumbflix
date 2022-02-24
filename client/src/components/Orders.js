import React from 'react';
import { useQuery } from 'react-query';
import { Col } from 'react-bootstrap';
import OrderItem from './OrderItem';
import Order404 from './Order404';
import { API } from '../config';

const api = API();
const fetchOrder = async () => {
  const config = {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + localStorage.token,
    },
  };

  const response = await api.get('/orders', config);
  return response;
};

export default function Order() {
  const { data, isSuccess, isLoading } = useQuery('ordersCache', fetchOrder);
  return (
    <Col md={6}>
      <h3 className="text-white fw-bold">History Transaction</h3>
      <div className="orders">
        {isLoading && <p>Loading...</p>}
        {isSuccess && data.length > 0 ? (
          data?.map((item) => <OrderItem key={item.id} data={item} />)
        ) : (
          <Order404 className="h-100" />
        )}
      </div>
    </Col>
  );
}
