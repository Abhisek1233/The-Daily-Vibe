import mongoose from "mongoose";

const newsArticleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    summary: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    tag: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Location",
        required: true
    },
    relativeNewsArticles: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "NewsArticle"
        }
    ],
    mediaUrls: [
        {
            type: String,
            required: true,
            trim: true
        }
    ],
    isTrending: {
        type: Boolean,
        default: false
    },
    view: {
        type: Number,
        default: 0,
        min: 0
    },
    publishedAt: {
        type: Date
    }
}, {
    timestamps: true
});

export default mongoose.model("NewsArticle", newsArticleSchema);
