const { film, category, categoryFilm, transaction, sequelize } = require('../../models');
const { Op } = require('sequelize');
const Joi = require('joi');

const checkOrder = async (userId, filmId) => {
  return transaction.findOne({
    where: {
      // [Op.ne]: [{ status: 'cancel' }],
      [Op.and]: [{ userId }, { filmId }],
    },
    attributes: ['userId', 'status'],
    include: {
      model: film,
      attributes: { exclude: ['id', 'createdAt', 'updatedAt'] },
      include: {
        model: category,
        as: 'categories',
        attributes: ['name'],
        through: {
          mode: categoryFilm,
          attributes: [],
        },
      },
    },
  });
};

exports.addFilm = async (req, res) => {
  let data = {
    ...req.body,
    category: parseInt(req.body.category),
  };

  const schema = Joi.object({
    title: Joi.string().required(),
    category: Joi.number().required(),
    price: Joi.number().required(),
    linkFilm: Joi.string().uri().required(),
    description: Joi.string().required(),
  });

  const { error } = schema.validate(data);

  if (error) {
    return res.status(400).send({
      status: 'failed',
      error: {
        message: error.details[0].message,
      },
    });
  }

  try {
    data = {
      ...data,
      url: req.body.linkFilm,
      thumbnail: req.file.filename,
      categoryFilm: {
        categoryId: parseInt(req.body.category),
      },
    };

    // Insert data multiple table based on relation key
    const dataFilm = await film.create(data, {
      include: { model: categoryFilm },
    });

    res.status(200).send({
      status: 'success',
      data: { dataFilm },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: 'failed',
      message: 'Server Error',
    });
  }
};

exports.getFilm = async (req, res) => {
  const { id: filmId } = req.params;
  console.log('userid', req.user);

  try {
    if (req.user) {
      //  get datail film if use already purchased
      const hasFilm = await checkOrder(req.user, filmId);

      if (hasFilm) {
        return res.status(200).send({
          status: 'success',
          data: {
            film: hasFilm,
          },
        });
      }
    }

    // get detail film
    const dataFilm = await film.findOne({
      where: { id: filmId },
      attributes: { exclude: ['id', 'createdAt', 'updatedAt', 'url'] },
      include: {
        model: category,
        as: 'categories',
        attributes: ['name'],
        through: {
          model: categoryFilm,
          attributes: [],
        },
      },
    });

    const data = {
      title: dataFilm.title,
      price: dataFilm.price,
      description: dataFilm.description,
      thumbnail: process.env.BASE_URL + dataFilm.thumbnail,
      category: dataFilm.categories[0],
      banner: process.env.BASE_URL + dataFilm.banner,
    };

    res.status(200).send({
      status: 'success',
      data,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: 'failed',
      message: 'Server error',
    });
  }
};

exports.getFilms = async (req, res) => {
  try {
    const data = await categoryFilm.findAll({
      attributes: [],
      include: [
        { model: film, attributes: { exclude: ['createdAt', 'updatedAt'] } },
        { model: category, attributes: { exclude: ['id', 'createdAt', 'updatedAt'] } },
      ],
    });

    const films = data.map((item) => ({
      id: item.film.id,
      title: item.film.title,
      category: item.category.name,
      price: item.film.price,
      description: item.film.description,
      thumbnail: process.env.BASE_URL + item.film.thumbnail,
      banner: process.env.BASE_URL + item.film.banner,
    }));

    res.status(200).send({
      status: 'success',
      data: {
        films,
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

exports.getFilmForBanner = async (req, res) => {
  try {
    const dataBanner = await film.findAll({
      include: [
        {
          model: transaction,
          required: false,
          attributes: [],
        },
      ],
      where: {
        [Op.or]: [
          sequelize.where(sequelize.col('transactions.filmId'), 'IS', null),
          {
            [Op.and]: [
              sequelize.where(sequelize.col('transactions.userId'), '=', req.user.id),
              sequelize.where(sequelize.col('transactions.status'), '=', 'cancel'),
            ],
          },
        ],
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'url', 'thumbnail'],
      },
      order: sequelize.random(),
      raw: true,
    });

    const data = dataBanner.map((item) => ({
      ...item,
      banner: process.env.BASE_URL + item.banner,
    }));

    res.status(200).send({
      status: 'success',
      data: data[0],
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: 'failed',
      message: 'Server error',
    });
  }
};
