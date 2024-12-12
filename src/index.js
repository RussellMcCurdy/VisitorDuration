"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sdk = require('@envoy/envoy-integrations-sdk');
const { envoyMiddleware, errorMiddleware } = sdk;
const app = express_1.default();
// Use the correct middleware from the SDK
app.use(envoyMiddleware());
// Define routes
app.post('/your-route', (req, res) => {
    const envoy = req.envoy; // Access the SDK added by envoyMiddleware
    console.log(envoy);
    res.send('Middleware works!');
});
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
app.post('/visitor-sign-in', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const envoy = req.envoy;
    if (!envoy) {
        return res.status(400).send({ error: 'Envoy object is missing from the request' });
    }
    const { job, meta, payload } = envoy;
    const hello = meta.config.HELLO;
    const visitorName = payload.attributes['full-name'];
    const message = `${hello} ${visitorName}!`; // Custom greeting
    yield job.attach({ label: 'Hello', value: message });
    res.send({ hello });
}));
app.post('/visitor-sign-out', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const envoy = req.envoy;
    if (!envoy) {
        return res.status(400).send({ error: 'Envoy object is missing from the request' });
    }
    const { job, meta, payload } = envoy;
    const goodbye = meta.config.GOODBYE;
    const visitorName = payload.attributes['full-name'];
    const message = `${goodbye} ${visitorName}!`;
    yield job.attach({ label: 'Goodbye', value: message });
    res.send({ goodbye });
}));
// Use the error middleware
app.use(errorMiddleware());
// Start the server
const listener = app.listen(process.env.PORT || 3000, () => {
    const address = listener.address();
    if (address && typeof address === 'object' && 'port' in address) {
        console.log(`Listening on port ${address.port}`);
    }
    else {
        console.log('Listening on an unknown address');
    }
});
