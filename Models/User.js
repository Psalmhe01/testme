import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  subscribedTopics: [
    {
      type: Schema.Types.ObjectId,
      ref: "Topic",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },

})
module.exports = mongoose.model("User", userSchema);