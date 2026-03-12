const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'docure/prescriptions',
    allowed_formats: ['pdf', 'png', 'jpg', 'jpeg'],
    resource_type: 'auto',
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

module.exports = upload;