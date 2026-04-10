const express = require('express');
const Service = require('../Models/service');
const router = express.Router();
const { createService } = require('../Controllers/servicecontroller');
const protect = require('../Middleware/authmiddleware');

router.get('/', async (req, res) => {
  try {
    const { lat, lng, radius } = req.query;
    let query = {};

    if (lat && lng) {
      query.location = {
        $near: {
          $geometry: { 
            type: "Point", 
            coordinates: [parseFloat(lng), parseFloat(lat)] 
          },
          $maxDistance: parseInt(radius) || 30000 // default 30km
        }
      };
    }

    const services = await Service.find(query).populate('provider', 'name businessName');
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate('provider', 'name businessName experience bio');
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/my-services', protect, async (req, res) => {
  try {
    const services = await Service.find({ provider: req.user._id });
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', protect, createService);

router.delete('/:id', protect, async (req, res) => {
  try {
    const service = await Service.findOneAndDelete({ _id: req.params.id, provider: req.user._id });
    if (!service) {
      return res.status(404).json({ message: "Service not found or unauthorized" });
    }
    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

