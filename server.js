const express = require('express');
const next = require('next');
const dotenv = require('dotenv');

dotenv.config();

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  server.use(express.json());

  const apiRouter = require('./api/routes');
  const { notFound, errorHandler } = require('./api/middleware/errorHandler');

  server.use('/api/v1', apiRouter);
  server.use('/api/v1', notFound);
  server.use(errorHandler);

  // Sample REST API endpoint
  server.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from Node.js back-end!' });
  });

  // Handle all other requests with Next.js
  server.use((req, res) => {
    return handle(req, res);
  });

  const port = process.env.API_PORT || process.env.PORT || 3000;
  server.listen(port, (err) => {
    if (err) {
        console.error('Error starting server:', err);
        process.exit(1);
    }
    console.log(`> Ready on http://localhost:${port}`);
  });
}).catch((ex) => {
  console.error(ex.stack);
  process.exit(1);
});