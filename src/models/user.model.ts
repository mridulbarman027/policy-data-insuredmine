import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName: String,
  dob: Date,
  address: String,
  phone: String,
  state: String,
  zip: String,
  email: String,
  gender: String,
  userType: String,
});

export default mongoose.model('User', userSchema);
