const express = require('express');
const Service = require('../Models/service');
const router = express.Router();
const { createService } = require('../Controllers/servicecontroller');
const protect = require('../Middleware/authmiddleware');

router.get('/', async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', protect, createService);

module.exports = router;

