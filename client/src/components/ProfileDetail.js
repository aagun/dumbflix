import React from 'react';
import { Col, Row } from 'react-bootstrap';
import Text from './Text';
import Label from './Label';
import defaultAvatar from '../assets/default-avatar.png';
import { useUserContext } from '../context/userContext';
import { API } from '../config';
import { useQuery } from 'react-query';

const api = API();

const getProfile = async () => {
  const config = {
    method: 'GET',
    heaers: {
      Authorization: 'Bearer ' + localStorage.token,
    },
  };

  const response = await api.get('/profile', config);
  return response;
};

const handleAvatar = (image) => {
  return image ? image : defaultAvatar;
};

const handlePhone = (phone) => {
  return phone ? phone : '-';
};

export default function ProfileDetail() {
  const [state] = useUserContext();
  const { user } = state;
  let { data: profile } = useQuery('profileCache', getProfile);

  return (
    <Col md={6}>
      <h3 className="text-white fw-bold mb-5">My Profile</h3>
      <Row>
        <Col md={4}>
          <img src={handleAvatar(profile?.avatar)} alt="username" className="profile-picture" />
        </Col>
        <Col md={8}>
          <div className="mb-4">
            <Label>Full Name</Label>
            <Text>{user.fullName}</Text>
          </div>
          <div className="mb-4">
            <Label>Email</Label>
            <Text>{user.email}</Text>
          </div>
          <div>
            <Label>Phone</Label>
            <Text>{handlePhone(profile?.phone)}</Text>
          </div>
        </Col>
      </Row>
    </Col>
  );
}
