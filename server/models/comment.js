import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    news: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NewsArticle",
      required: true
    },
    text: {
      type: String,
      required: true, 
      trim: true
    },
    replies: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true
        },
        text: {
          type: String,
          required: true,
          trim: true
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
},{
    timestamps: true
});

export default mongoose.model("Comment", commentSchema);
