import mongoose from 'mongoose';

const agentSchema = new mongoose.Schema({
  agent: String,
});

export default mongoose.model('Agent', agentSchema);
