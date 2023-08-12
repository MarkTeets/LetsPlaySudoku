import { Schema, model } from 'mongoose';

// Types
import { Session } from '../../server/backendTypes';

/**
 * `createdAt` uses's Mongo's automatic document expiration service via the `expires` property.
 * This automatically be removes the session after the given time in seconds.
 * 1 week = 604800 seconds
 */

const sessionSchema = new Schema<Session>({
  cookieId: { type: String, required: true, unique: true },
  createdAt: { type: Date, expires: 604800, default: Date.now }
});

const Session = model('Session', sessionSchema);

export default Session;
