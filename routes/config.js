const express = require('express');
const router = express.Router();

// middleware
const { auth, requireAuth } = require('../middleware');
const uploadLogo = require('../middleware/multerLogo');

const {
  getCSS,
  updateCSS,
  getConfig,
  updateConfig,
  uploadLogo: uploadLogoController,
  deleteLogo,
} = require('../controllers/config');

router.route('/').get(getConfig).put(auth, requireAuth, updateConfig);

router.route('/0/css').get(getCSS).put(auth, requireAuth, updateCSS);

router
  .route('/0/logo')
  .post(auth, requireAuth, uploadLogo, uploadLogoController)
  .delete(auth, requireAuth, deleteLogo);

module.exports = router;
