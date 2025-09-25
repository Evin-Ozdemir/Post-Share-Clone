const mongoose = require("mongoose");

const AuthSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, unique: true },
  password: { type: String, required: true, trim: true },
  avatar: { type: String, default: "" },
  bio: { type: String, default: "" },
  followers: [{ type: String }], // user IDs who follow this user
  following: [{ type: String }], // user IDs this user follows
  notifications: [
    {
      type: {
        type: String,
        enum: ["like", "comment", "follow"],
        required: true,
      },
      from: { type: String, required: true },
      postId: { type: String, default: "" },
      read: { type: Boolean, default: false },
      date: { type: Date, default: Date.now },
    },
  ],
  date: { type: Date, default: new Date() },
});

const Auth = mongoose.model("Auth", AuthSchema);

module.exports = Auth;
