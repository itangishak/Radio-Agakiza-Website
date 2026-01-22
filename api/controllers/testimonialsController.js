const asyncHandler = require('../utils/asyncHandler');
const svc = require('../services/testimonialsService');

// Public: list published testimonials
exports.listPublished = asyncHandler(async (req, res) => {
  const { limit, offset } = req.query;
  const data = await svc.listPublished({ limit, offset });
  res.json(data);
});

// Admin/Journalist: list all testimonials
exports.listAll = asyncHandler(async (req, res) => {
  const { limit, offset } = req.query;
  const data = await svc.listAll({ limit, offset });
  res.json(data);
});

exports.get = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const row = await svc.getById(id);
  if (!row) return res.status(404).json({ message: 'Testimonial not found' });
  res.json(row);
});

exports.create = asyncHandler(async (req, res) => {
  const id = await svc.create(req.body, req.user?.id);
  const row = await svc.getById(id);
  res.status(201).json(row);
});

exports.update = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const ok = await svc.update(id, req.body);
  if (!ok) return res.status(400).json({ message: 'Nothing to update' });
  const row = await svc.getById(id);
  res.json(row);
});

exports.remove = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const ok = await svc.remove(id);
  if (!ok) return res.status(404).json({ message: 'Testimonial not found' });
  res.status(204).send();
});
