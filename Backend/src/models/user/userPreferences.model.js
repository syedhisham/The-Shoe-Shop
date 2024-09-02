import mongoose from "mongoose";

const userPreferencesSchema = new mongoose.Schema({
  acceptedTerms: {
    type: Boolean,
    required: true,
    default: false,
  },
  subscribeToNewsletter: {
    type: Boolean,
    default: false,
  },
  subscribeToSMSAlerts: {
    type: Boolean,
    default: false,
  },
});

const UserPreferences = mongoose.model("UserPreferences", userPreferencesSchema);
export default UserPreferences;
