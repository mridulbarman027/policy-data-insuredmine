import { model, Schema } from 'mongoose';

import { COLLECTION } from '../constats/collections';

const agentSchema = new Schema({
  agent: String,
});

export const AgentModel = model(COLLECTION.AGENT, agentSchema);

const userSchema = new Schema({
  firstname: String,
  dob: Date,
  address: String,
  phone: String,
  state: String,
  zip: String,
  email: String,
  gender: String,
  userType: String,
});

export const UserModel = model(COLLECTION.USER, userSchema);

const policyCarrierSchema = new Schema({
  company_name: String,
  category_id: String,
});

export const PolicyCarrierModel = model(COLLECTION.POLICY_CARRIER, policyCarrierSchema);

const policyCategorySchema = new Schema({
  category_name: String,
});

export const PolicyCategoryModel = model(COLLECTION.POLICY_CATEGORY, policyCategorySchema);

const userAccountSchema = new Schema({
  account_name: String,
  user_id: String,
});

export const UserAccountModel = model(COLLECTION.USER_ACCOUNT, userAccountSchema);

const policyInfoSchema = new Schema({
  policy_number: String,
  policy_start_date: String,
  policy_end_date: String,
  policy_carrier_id: String,
  policy_category_id: String,
  agent_id: String,
  user_id: String,
  user_account_id: String,
});

export const PolicyInfoModel = model(COLLECTION.POLICY_INFO, policyInfoSchema);

const messageSchema = new Schema({
  _id: String,
  message: String,
  date_time: Date,
});

export const MessageModel = model(COLLECTION.MESSAGE, messageSchema);
