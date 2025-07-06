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
    preferences: [{
        type: String,
    }],
    verificationToken: {
        type: String,
    },
    verificationExpire: {
        type: Date,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: {
        type:String,
    },
    resetPasswordExpire: {
        type: Date,
    }
}, {
    timestamps: true
});


export default mongoose.model("User", userSchema);