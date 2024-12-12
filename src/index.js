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
// Middleware for Envoy
app.use(envoyMiddleware());
// Validation URL route
app.post('/validation-url', (req, res) => {
    const envoy = req.envoy;
    if (!envoy || !envoy.payload) {
        console.error('Invalid payload received in validation step.');
        return res.status(400).send({ message: 'Invalid payload received.' });
    }
    const payload = envoy.payload;
    const duration = Number(payload.DURATION);
    if (isNaN(duration) || duration < 0 || duration > 180) {
        console.error('Invalid duration value:', payload.DURATION);
        return res.status(400).send({ message: 'Please enter a valid duration between 0 and 180 minutes.' });
    }
    console.log('Saving DURATION to config:', duration);
    res.send({ DURATION: duration });
});
// Visitor sign-out route
app.post('/visitor-sign-out', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const envoy = req.envoy;
    if (!envoy) {
        return res.status(400).send({ error: 'Envoy object is missing from the request.' });
    }
    const { job, meta, payload } = envoy;
    try {
        // Extract and validate duration from meta.config
        const durationAllowed = Number(meta.config.DURATION);
        if (isNaN(durationAllowed) || durationAllowed < 0 || durationAllowed > 180) {
            console.error('Invalid duration configuration:', meta.config.DURATION);
            return res.status(400).send({
                error: 'Invalid configuration for allowed duration. Please ensure it is between 0 and 180 minutes.',
            });
        }
        // Extract and validate sign-in and sign-out times
        const { 'full-name': visitorName, 'signed-in-at': signInTimeStr, 'signed-out-at': signOutTimeStr } = payload.attributes;
        if (!signInTimeStr || !signOutTimeStr) {
            console.error('Missing sign-in or sign-out time.', { signInTimeStr, signOutTimeStr });
            return res.status(400).send({ error: 'Sign-in or sign-out time is missing from the payload.' });
        }
        const signInTime = new Date(signInTimeStr);
        const signOutTime = new Date(signOutTimeStr);
        if (isNaN(signInTime.getTime()) || isNaN(signOutTime.getTime())) {
            console.error('Invalid date format for sign-in or sign-out time.', { signInTimeStr, signOutTimeStr });
            return res.status(400).send({ error: 'Invalid date format for sign-in or sign-out time.' });
        }
        // Calculate the actual duration of the visit
        const actualDuration = (signOutTime.getTime() - signInTime.getTime()) / 60000;
        let message = `Visitor ${visitorName} stayed for ${actualDuration.toFixed(2)} minutes.`;
        if (actualDuration > durationAllowed) {
            message += ` Warning: This exceeds the allowed duration of ${durationAllowed} minutes.`;
        }
        // Attach the message to the job
        yield job.attach({ label: 'Duration', value: message });
        console.log('Message attached to job:', { label: 'Duration', value: message });
        res.send({ message });
    }
    catch (error) {
        console.error('Error processing visitor sign-out:', error);
        res.status(500).send({ error: 'An error occurred while processing the visitor sign-out.' });
    }
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
