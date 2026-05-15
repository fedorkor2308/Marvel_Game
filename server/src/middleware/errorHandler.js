export function errorHandler(err, _req, res, _next) {
  const status = err.status || 500;
  if (process.env.NODE_ENV !== 'production') console.error(err);
  res.status(status).json({ error: err.message || 'Internal server error' });
}
