const Service = require('../Models/service');

exports.createService = async (req, res) => {
  try {
    req.body.provider = req.user._id;
    const service = await Service.create(req.body);
    res.status(201).json(service);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};