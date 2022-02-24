import React, { Fragment, useState } from 'react';
import { Container, Form, Col, Row, Alert } from 'react-bootstrap';
import Button from '../components/Button';
import Navbar from '../components/Navbar';
import attcahIcon from '../assets/icons/attach.svg';
import convertRupiah from 'rupiah-format';
import ReactHTMLDatalist from 'react-html-datalist';
import { useMutation, useQuery } from 'react-query';
import { API } from '../config';

let api = API();

const fetchCategories = async () => {
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const response = await api.get('/categories', config);
  return response.data;
};

const handleCloseMessage = (setMessage) => {
  setTimeout(() => {
    setMessage('');
  }, 15000);
};

const resetStates = (args) => {
  const { setForm, setPreview, setFormatedPrice } = args;

  setForm({
    title: '',
    category: '',
    price: '',
    linkFilm: '',
    description: '',
    thumbnail: '',
  });
  setPreview('');
  setFormatedPrice('');
};

const handleMessage = (response, setMessage) => {
  if (response.status === 'failed') {
    setMessage({ response: response.error.message, variant: 'danger' });
    return handleCloseMessage(setMessage);
  }

  setMessage({
    response: 'Data berhasil ditambahkan',
    variant: 'success',
  });
  handleCloseMessage(setMessage);
};

export default function AddFilm() {
  document.title = 'Online Cinema | Add Film';

  const [preview, setPreview] = useState('');
  const [formatedPrice, setFormatedPrice] = useState('');
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    title: '',
    category: '',
    price: '',
    linkFilm: '',
    description: '',
    thumbnail: '',
  });
  const { title, category, price, linkFilm, description, thumbnail } = form;

  // queries
  let { data: categories, isSuccess } = useQuery('categoriesCache', fetchCategories);

  const previewImage = (input) => {
    if (input.type === 'file') {
      const url = URL.createObjectURL(input.files[0]);
      setPreview(url);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.type === 'file' ? e.target.files : e.target.value,
    });

    previewImage(e.target);
  };

  const handleFocus = () => {
    setFormatedPrice('');
  };

  // format price to idr curreny when onFoucusOut
  const handleBlur = () => {
    setFormatedPrice(convertRupiah.convert(price).split(',')[0]);
  };

  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();
      const formData = new FormData();

      if (typeof form.thumbnail === 'object') {
        formData.set('thumbnail', thumbnail[0], thumbnail[0].name);
      } else {
        setMessage({ response: 'Please attach an image', variant: 'danger' });
      }

      formData.set('title', title);
      formData.set('category', category);
      formData.set('price', price);
      formData.set('linkFilm', linkFilm);
      formData.set('description', description);

      const config = {
        method: 'POST',
        headers: {
          Authorization: 'Basic ' + localStorage.token,
        },
        body: formData,
      };

      const response = await api.post('/film', config);

      handleMessage(response, setMessage);
      if (response.status === 'success') {
        resetStates({ setForm, setPreview, setFormatedPrice });
      }
    } catch (err) {
      console.log(err);
    }
  });

  return (
    <Fragment>
      <Navbar />
      <Container className="mb-5">
        <h3 className="text-white fw-bold mb-5">Add Film</h3>
        <div>
          <Row>
            {preview && (
              <Col>
                <img src={preview} alt="" className="img-preview" />
              </Col>
            )}
            <Col md={preview ? 9 : 12}>
              {message && (
                <Alert variant={message.variant} dismissible onClick={() => setMessage('')}>
                  {message.response}
                </Alert>
              )}
              <Form onSubmit={(e) => handleSubmit.mutate(e)}>
                <Row>
                  <Col md={9}>
                    <Form.Control
                      className="mb-4"
                      type="text"
                      placeholder="Title"
                      name="title"
                      value={title}
                      onChange={handleChange}
                    />
                  </Col>
                  <Col md={3}>
                    <Form.Control
                      className="mb-4"
                      type="file"
                      hidden
                      id="thumbnail"
                      name="thumbnail"
                      onChange={handleChange}
                    />
                    <label
                      htmlFor="thumbnail"
                      className="btn btn-outline-secondary fw-bold w-100 d-flex justify-content-between align-items-center"
                    >
                      <span>Attach Thumbnail</span>
                      <img src={attcahIcon} alt="ic_attach" />
                    </label>
                  </Col>
                </Row>
                <ReactHTMLDatalist
                  name="category"
                  onChange={handleChange}
                  classNames="form-control mb-1"
                  options={isSuccess ? [...categories] : []}
                />
                <p className="text-danger ms-2 fw-bold" style={{ fontSize: '.9rem' }}>
                  Harap hapus category sebelum input data baru
                </p>
                <Form.Control
                  className="mb-4 mt-2"
                  type="text"
                  placeholder="Price"
                  name="price"
                  value={formatedPrice ? formatedPrice : price}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onFocus={handleFocus}
                />
                <Form.Control
                  className="mb-4"
                  type="url"
                  placeholder="Link Film"
                  name="linkFilm"
                  value={linkFilm}
                  onChange={handleChange}
                />
                <Form.Control
                  className="mb-4"
                  as="textarea"
                  placeholder="Description"
                  style={{ height: '200px' }}
                  name="description"
                  value={description}
                  onChange={handleChange}
                />
                <Col className="d-flex justify-content-end">
                  <Button type="submit" className="btn-primary">
                    Add Film
                  </Button>
                </Col>
              </Form>
            </Col>
          </Row>
        </div>
      </Container>
    </Fragment>
  );
}
