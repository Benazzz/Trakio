const errorHandler = (err, req, res, next) => {
  if (err.type === 'entity.parse.failed')
    return res.status(400).json({ error: 'Malformed JSON body' });

  if (err.code === '23503')
    return res.status(422).json({ error: 'Referenced resource does not exist' });
  if (err.code === '23505')
    return res.status(409).json({ error: 'Resource already exists' });
  if (err.code === '23514')
    return res.status(422).json({ error: 'Value violates a constraint' });
  if (err.code === '23502')
    return res.status(400).json({ error: 'Required field is missing' });
  if (err.code === '22P02')
    return res.status(400).json({ error: 'Invalid value format' });

  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
};

export default errorHandler;