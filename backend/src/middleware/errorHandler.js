export const errorHandler = (err, _req, res, _next) => {
  console.error(err);

  if (err?.code === 'P2002') {
    const target = Array.isArray(err?.meta?.target) ? err.meta.target[0] : err?.meta?.target;
    const field = target || 'field';

    if (field === 'name') {
      return res.status(409).json({ error: 'A category with this name already exists' });
    }

    return res.status(409).json({ error: `Duplicate value for ${field}` });
  }

  if (err?.code === 'P2025') {
    return res.status(404).json({ error: 'Record not found' });
  }

  res.status(err.statusCode || err.status || 500).json({
    error: err.message || 'Internal server error',
  });
};
