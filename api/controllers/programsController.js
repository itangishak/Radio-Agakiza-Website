const asyncHandler = require('../utils/asyncHandler');
const svc = require('../services/programsService');

exports.list = asyncHandler(async (req, res) => {
  const data = await svc.listPrograms();
  res.json(data);
});

exports.get = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const data = await svc.getProgramById(id);
  if (!data) return res.status(404).json({ message: 'Program not found' });
  res.json(data);
});

exports.create = asyncHandler(async (req, res) => {
  const id = await svc.createProgram(req.body, req.user?.id);
  const data = await svc.getProgramById(id);
  res.status(201).json(data);
});

exports.update = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const ok = await svc.updateProgram(id, req.body);
  if (!ok) return res.status(400).json({ message: 'Nothing to update' });
  const data = await svc.getProgramById(id);
  res.json(data);
});

exports.remove = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const ok = await svc.deleteProgram(id);
  if (!ok) return res.status(404).json({ message: 'Program not found' });
  res.status(204).send();
});

// Hosts
exports.createHost = asyncHandler(async (req, res) => {
  const hostId = await svc.createHost(req.body);
  res.status(201).json({ id: hostId });
});

exports.listHosts = asyncHandler(async (req, res) => {
  const data = await svc.listHosts();
  res.json(data);
});

exports.attachHost = asyncHandler(async (req, res) => {
  const programId = Number(req.params.id);
  const hostId = Number(req.params.hostId);
  const is_primary = !!(req.body?.is_primary);
  await svc.attachHost(programId, hostId, is_primary);
  res.status(204).send();
});

exports.detachHost = asyncHandler(async (req, res) => {
  const programId = Number(req.params.id);
  const hostId = Number(req.params.hostId);
  await svc.detachHost(programId, hostId);
  res.status(204).send();
});

// Schedule
exports.listSchedule = asyncHandler(async (req, res) => {
  const programId = Number(req.params.id);
  const data = await svc.listSchedule(programId);
  res.json(data);
});

exports.addSchedule = asyncHandler(async (req, res) => {
  const programId = Number(req.params.id);
  const id = await svc.addSchedule(programId, req.body);
  res.status(201).json({ id });
});

exports.updateSchedule = asyncHandler(async (req, res) => {
  const programId = Number(req.params.id);
  const scheduleId = Number(req.params.scheduleId);
  const ok = await svc.updateSchedule(programId, scheduleId, req.body);
  if (!ok) return res.status(400).json({ message: 'Nothing to update' });
  res.status(204).send();
});

exports.deleteSchedule = asyncHandler(async (req, res) => {
  const programId = Number(req.params.id);
  const scheduleId = Number(req.params.scheduleId);
  const ok = await svc.deleteSchedule(programId, scheduleId);
  if (!ok) return res.status(404).json({ message: 'Schedule not found' });
  res.status(204).send();
});

exports.live = asyncHandler(async (req, res) => {
  const data = await svc.liveNowNext();
  res.json(data);
});
