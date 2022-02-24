import React, { Fragment } from 'react';
import { Container, OverlayTrigger, Popover, Table } from 'react-bootstrap';
import MenuItem from '../components/MenuItem';
import Navbar from '../components/Navbar';
import dropIcon from '../assets/icons/drop.svg';

const menu = () => {
  return (
    <Popover id="popover-basic">
      <Popover.Body className="text-white" style={{ width: '200px' }}>
        <MenuItem className="text-success" onClick={handleApprove}>
          Approve
        </MenuItem>
        <MenuItem className="text-danger" onClick={handleCancel}>
          Cancel
        </MenuItem>
      </Popover.Body>
    </Popover>
  );
};

const handleApprove = () => {
  console.log('Aku diapprove');
};

const handleCancel = () => {
  console.log('Aku dicancel');
};

export default function Transactions() {
  document.title = 'Online Cinema | Admin';

  const setColorDependsPaymentStatus = (paymentStatus) => {
    if (paymentStatus === 'Approve') return 'text-success';
    if (paymentStatus === 'Cancle') return 'text-danger';
    if (paymentStatus === 'Pending') return 'text-warning';
  };

  const color = setColorDependsPaymentStatus('Approve');

  return (
    <Fragment>
      <Navbar />
      <Container>
        <h3 className="text-white fw-bold mb-5">Incoming Transaction</h3>
        <Table striped hover variant="dark" responsive="sm">
          <thead>
            <tr>
              <th>No</th>
              <th>Users</th>
              <th>Bukti Transaksi</th>
              <th>Film</th>
              <th>Account Number</th>
              <th>Payment Status</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Mark Otto</td>
              <td>bca.jpg</td>
              <td>Tom and Jerry</td>
              <td>0981312321</td>
              <td className={`fw-bold ${color}`}>Approve</td>
              <td className="fw-bold text-center">
                <OverlayTrigger trigger="click" placement="bottom" rootClose overlay={menu()}>
                  <img src={dropIcon} style={{ cursor: 'pointer' }} alt="ic_drop" />
                </OverlayTrigger>
              </td>
            </tr>
          </tbody>
        </Table>
        <div className="d-flex justify-content-end align-items-center w-100 mb-5">
          <button className="btn btn-primary">Prev</button>
          <p className="mx-3 my-auto fw-bold text-white">1</p>
          <button className="btn btn-primary">Next</button>
        </div>
      </Container>
    </Fragment>
  );
}
