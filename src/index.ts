import express from 'express';
const sdk = require('@envoy/envoy-integrations-sdk');
import { EnvoyPluginSDK } from '@envoy/envoy-integrations-sdk';

declare global {
  namespace Express {
    interface Request {
      envoy?: EnvoyPluginSDK;
    }
  }
}

const { envoyMiddleware, errorMiddleware } = sdk;
const app = express();

// Use the correct middleware
app.use(envoyMiddleware());

app.post('/your-route', (req, res) => {
    const envoy = req.envoy; // Access the SDK added by envoyMiddleware
    console.log(envoy);
    res.send('Middleware works!');
});

app.use(errorMiddleware());

const listener = app.listen(process.env.PORT || 3000, () => {
  const address = listener.address();
  if (address && typeof address === 'object' && 'port' in address) {
      console.log(`Listening on port ${address.port}`);
  } else {
      console.log('Listening on an unknown address');
  }
});



/*import express from 'express';
import sdk from '@envoy/envoy-integrations-sdk';

declare module 'express' {
  interface Request {
    envoy?: {
      job: {
        attach: (data: { label: string; value: string }) => Promise<void>;
      };
      meta: {
        config: Record<string, any>;
      };
      payload: {
        attributes: Record<string, string>;
      };
    };
  }
}

const { envoyMiddleware, errorMiddleware } = sdk;

const app = express();

// Use the correct middleware from the SDK
app.use(envoyMiddleware);

// Define routes
app.post('/hello-options', (req, res) => {
  res.send([
    { label: 'Hello', value: 'Hello' },
    { label: 'Hola', value: 'Hola' },
    { label: 'Aloha', value: 'Aloha' },
  ]);
});

app.post('/goodbye-options', (req, res) => {
  res.send([
    { label: 'Goodbye', value: 'Goodbye' },
    { label: 'Adios', value: 'Adios' },
    { label: 'Aloha', value: 'Aloha' },
  ]);
});

app.use((req, res, next) => {
  console.log('Envoy Middleware:', req.envoy); // Check if `envoy` is being added
  next();
});


/*app.post('/visitor-sign-in', async (req, res) => {
  const envoy = req.envoy; // Ensure `envoyMiddleware` sets this property
  if (!envoy) {
    return res.status(400).send({ error: 'Envoy object is missing from the request' });
  }

  const { job, meta, payload } = envoy;
  const hello = meta.config.HELLO;
  const visitorName = payload.attributes['full-name'];
  
  const message = `${hello} ${visitorName}!`; // Custom greeting
  await job.attach({ label: 'Hello', value: message });

  res.send({ hello });
});

app.post('/visitor-sign-out', async (req, res) => {
  const envoy = req.envoy;
  if (!envoy) {
    return res.status(400).send({ error: 'Envoy object is missing from the request' });
  }

  const { job, meta, payload } = envoy;
  const goodbye = meta.config.GOODBYE;
  const visitorName = payload.attributes['full-name'];
  
  const message = `${goodbye} ${visitorName}!`;
  await job.attach({ label: 'Goodbye', value: message });

  res.send({ goodbye });
});

// Use the error middleware
app.use(errorMiddleware);

// Start the server
const listener = app.listen(process.env.PORT || 0, () => {
  const address = listener.address();
  if (address && typeof address !== 'string') {
    console.log(`Listening on port ${address.port}`);
  } else {
    console.error('Failed to retrieve listener address');
  }
});
*/