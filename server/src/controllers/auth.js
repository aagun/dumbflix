const { user, profile } = require('../../models');
const { Op } = require('sequelize');
const Joi = require('joi');
const Bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');

const getUser = async (condition) => {
  const { email, id } = condition;

  console.log(email, id);

  return user.findOne({
    where: {
      [Op.or]: [
        {
          email: email ? email : '',
        },
        { id: id ? id : '' },
      ],
    },
  });
};

const isRegistered = (dataUser, res) => {
  if (!dataUser) {
    return res.status(400).send({
      status: 'failed',
      error: {
        message: 'Email and Password do not match',
      },
    });
  }
};

const isAccessGranted = (access, res) => {
  if (!access) {
    return res.status(400).send({
      status: 'failed',
      error: {
        message: 'Email and Password do not match',
      },
    });
  }
};

exports.register = async (req, res) => {
  const { fullName, email, password } = req.body;
  const data = {
    fullName,
    email,
    password,
  };

  // valdiate schema
  const schema = Joi.object({
    fullName: Joi.string().min(1).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  });

  // validate the request body
  const { error } = schema.validate(data);

  // send request if any error when validate
  if (error) {
    return res.status(400).send({
      status: 'failed',
      error: {
        message: error.details[0].message,
      },
    });
  }

  const isEmailRegistered = await getUser({ email });

  if (isEmailRegistered) {
    return res.status(400).send({
      status: 'failed',
      error: {
        message: 'Email already registered',
      },
    });
  }

  try {
    // generate salt (random value) with 10 rounds
    const salt = await Bcrypt.genSalt(10);

    // hash password from request with salt
    const hashedPassword = await Bcrypt.hash(password, salt);

    // reassign password from request with hashed password and assgin status to data
    data.password = hashedPassword;
    data.status = 'user';
    data.profile = {}; // auto create data profile when user register

    // store data to database
    const dataUser = await user.create(data, {
      include: { model: profile, as: 'profile' },
    });

    // create data user token with jwt
    const dataToken = {
      fullName: dataUser.fullName,
      email: dataUser.email,
    };

    // create token
    const token = JWT.sign(dataToken, process.env.TOKEN_KEY);

    // send response
    res.status(200).send({
      status: 'success',
      data: {
        fullName: dataUser.fullName,
        email: dataUser.email,
        token: token,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: 'failed',
      message: 'Server error',
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const data = {
    email,
    password,
  };

  // valdiate schema
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  });

  // validate the request body
  const { error } = schema.validate(data);

  // send request if any error when validate
  if (error) {
    return res.status(400).send({
      status: 'failed',
      error: {
        message: error.details[0].message,
      },
    });
  }

  // check if user registered
  const dataUser = await getUser({ email });
  isRegistered(dataUser, res);

  // check if password is match
  const access = await Bcrypt.compare(password, dataUser.password);
  isAccessGranted(access, res);

  try {
    const dataToken = {
      id: dataUser.id,
      fullName: dataUser.fullName,
      email: dataUser.email,
      status: dataUser.status,
    };

    const token = JWT.sign(dataToken, process.env.TOKEN_KEY);

    res.status(200).send({
      data: {
        user: { ...dataToken, token },
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: 'failed',
      message: 'Server error',
    });
  }
};

exports.checkAuth = async (req, res) => {
  const { id } = req.user;
  try {
    const dataUser = await getUser({ id });

    if (!dataUser) {
      return res.status(404).send({
        status: 'failed',
      });
    }

    res.status(200).send({
      status: 'success',
      data: {
        user: {
          id: dataUser.id,
          fullName: dataUser.fullName,
          email: dataUser.email,
          status: dataUser.status,
        },
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: 'failed',
      message: 'Server error',
    });
  }
};
