const asyncHandler = require('../utils/asyncHandler');
const svc = require('../services/articlesService');

exports.list = asyncHandler(async (req, res) => {
  const { status, limit, offset } = req.query;
  const data = await svc.listArticles({ status, limit, offset });
  res.json(data);
});

exports.get = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const row = await svc.getArticle(id);
  if (!row) return res.status(404).json({ message: 'Article not found' });
  res.json(row);
});

exports.create = asyncHandler(async (req, res) => {
  const authorId = req.user?.id;
  const id = await svc.createArticle(req.body, authorId);
  const row = await svc.getArticle(id);
  res.status(201).json(row);
});

exports.update = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const ok = await svc.updateArticle(id, req.body);
  if (!ok) return res.status(400).json({ message: 'Nothing to update' });
  const row = await svc.getArticle(id);
  res.json(row);
});

exports.remove = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const ok = await svc.deleteArticle(id);
  if (!ok) return res.status(404).json({ message: 'Article not found' });
  res.status(204).send();
});
