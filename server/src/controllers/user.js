const { transaction, film, profile } = require('../../models');
const { Op } = require('sequelize');

exports.getUserOrderHistory = async (req, res) => {
  try {
    const { id } = req.user;

    const data = await transaction.findAll({
      where: { userId: id },
      attributes: ['id', 'accountNumber', 'transferProof', 'status', 'createdAt'],
      include: {
        model: film,
        attributes: ['id', 'title', 'price', 'url', 'description'],
      },
    });

    console.log('ini data', data);

    res.status(200).send({
      status: 'success',
      data: {
        // profile: { purchasedFilm },
        data,
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

exports.getUserProfile = async (req, res) => {
  const { id: userId } = req.user;
  try {
    const data = await profile.findOne({ where: userId, attributes: ['avatar', 'phone'] });

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

exports.getPurchasedFilm = async (req, res) => {
  try {
    const { id } = req.user;

    const data = await transaction.findAll({
      where: {
        [Op.and]: [{ userId: id }, { status: 'approve' }],
      },
    });

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
