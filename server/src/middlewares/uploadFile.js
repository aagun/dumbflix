const multer = require('multer');

exports.uploadFile = (imageFIle) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads');
    },

    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname.replace(/\s/g, ''));
    },
  });

  const upload = multer({
    storage,
  }).single(imageFIle);

  return (req, res, next) => {
    upload(req, res, () => {
      return next();
    });
  };
};
