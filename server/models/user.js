import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    bookmarks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'NewsArticle'
        }
    ],
    preferences: [String]
}, {
    timestamps: true 
});



export default mongoose.model("User", userSchema);