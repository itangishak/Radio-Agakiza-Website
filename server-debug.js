const express = require('express');
const next = require('next');
const dotenv = require('dotenv');

dotenv.config();

console.log('Starting server...');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });

console.log('Next.js app created, preparing...');

app.prepare().then(() => {
  console.log('Next.js app prepared successfully');
  
  const server = express();
  server.use(express.json());

  console.log('Express server created');

  // Simple test endpoint
  server.get('/test', (req, res) => {
    res.json({ message: 'Server is working!' });
  });

  const handle = app.getRequestHandler();
  
  // API routes
  try {
    const apiRouter = require('./api/routes');
    server.use('/api/v1', apiRouter);
    console.log('API routes loaded');
  } catch (error) {
    console.error('Error loading API routes:', error);
  }

  // Next.js handler
  server.all('*', (req, res) => {
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
  console.error('Error preparing Next.js app:', ex);
  process.exit(1);
});
