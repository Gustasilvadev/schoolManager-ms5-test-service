const express = require('express');
const testRoutes = require('./testRoutes');
const gradeRoutes = require('./gradeRoutes');
const finalAverageRoutes = require('./finalAverageRoutes');

const router = express.Router();

router.use('/tests', testRoutes);
router.use('/grades', gradeRoutes);
router.use('/finalAverages', finalAverageRoutes);

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'test-service' });
});

module.exports = router;