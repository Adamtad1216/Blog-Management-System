export const errorHandler = (err, _req, res, _next) => {
  console.error(err);

  res.status(err.statusCode || err.status || 500).json({
    error: err.message || 'Internal server error',
  });
};
