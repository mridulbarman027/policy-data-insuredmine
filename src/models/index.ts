import { model, Schema } from 'mongoose';

import { COLLECTION } from '../constats/collections';

const agentSchema = new Schema({
  agent: String,
});

export const AgentModel = model(COLLECTION.AGENT, agentSchema);
