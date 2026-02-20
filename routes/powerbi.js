const express = require('express');
const router = express.Router();

const { auth, requireAuth, requireBody } = require('../middleware');

const {
  getReports,
  addReport,
  updateReport,
  deleteReport,
} = require('../controllers/powerbi');

router
  .route('/')
  .get(getReports)
  .post(auth, requireAuth, requireBody(['name', 'embedUrl']), addReport);

router
  .route('/:id')
  .put(auth, requireAuth, updateReport)
  .delete(auth, requireAuth, deleteReport);

module.exports = router;
