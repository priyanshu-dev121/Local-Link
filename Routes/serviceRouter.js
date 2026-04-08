const express = require('express');
const Service = require('../Models/service');
const router = express.Router();
const { createService } = require('../Controllers/servicecontroller');

router.get('/', async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', createService);

module.exports = router;

