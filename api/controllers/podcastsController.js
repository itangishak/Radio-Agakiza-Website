const asyncHandler = require('../utils/asyncHandler');
const svc = require('../services/podcastsService');

// Series
exports.listSeries = asyncHandler(async (req, res) => {
  const { limit, offset } = req.query;
  const data = await svc.listSeries({ limit, offset });
  res.json(data);
});

exports.getSeries = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const data = await svc.getSeries(id);
  if (!data) return res.status(404).json({ message: 'Series not found' });
  res.json(data);
});

exports.createSeries = asyncHandler(async (req, res) => {
  const id = await svc.createSeries(req.body, req.user?.id);
  const data = await svc.getSeries(id);
  res.status(201).json(data);
});

exports.updateSeries = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const ok = await svc.updateSeries(id, req.body);
  if (!ok) return res.status(400).json({ message: 'Nothing to update' });
  const data = await svc.getSeries(id);
  res.json(data);
});

exports.deleteSeries = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const ok = await svc.deleteSeries(id);
  if (!ok) return res.status(404).json({ message: 'Series not found' });
  res.status(204).send();
});

// Episodes
exports.listEpisodes = asyncHandler(async (req, res) => {
  const { series_id, status, limit, offset } = req.query;
  const data = await svc.listEpisodes({ series_id, status, limit, offset });
  res.json(data);
});

exports.getEpisode = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const data = await svc.getEpisode(id);
  if (!data) return res.status(404).json({ message: 'Episode not found' });
  res.json(data);
});

exports.createEpisode = asyncHandler(async (req, res) => {
  const id = await svc.createEpisode(req.body, req.user?.id);
  const data = await svc.getEpisode(id);
  res.status(201).json(data);
});

exports.updateEpisode = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const ok = await svc.updateEpisode(id, req.body);
  if (!ok) return res.status(400).json({ message: 'Nothing to update' });
  const data = await svc.getEpisode(id);
  res.json(data);
});

exports.deleteEpisode = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const ok = await svc.deleteEpisode(id);
  if (!ok) return res.status(404).json({ message: 'Episode not found' });
  res.status(204).send();
});
