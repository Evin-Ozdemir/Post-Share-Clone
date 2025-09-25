const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "Auth", required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  image: { type: String, default: "" },
  category: { type: String, default: "Genel" },
  tags: [{ type: String }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Auth" }], // user IDs who liked
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Auth",
        required: true,
      },
      text: { type: String, required: true },
      date: { type: Date, default: Date.now },
      likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Auth" }],
      replies: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Auth",
            required: true,
          },
          text: { type: String, required: true },
          date: { type: Date, default: Date.now },
          likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Auth" }],
        },
      ],
    },
  ],
  date: { type: Date, default: Date.now },
});

const Post = mongoose.model("post", PostSchema);

module.exports = Post;
