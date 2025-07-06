import mongoose from "mongoose";

const advertisementSchema = new mongoose.Schema({
    imageUrl: {
        type: String,
        required: true,
        trim: true
    },
    link: {
        type: String,
        trim: true,
        default: null
    },
    position: {
        type: String,
        enum: ['top', 'sidebar', 'footer'],
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                return !this.startDate || value > this.startDate;
            },
            message: 'endDate must be after startDate'
        }
    }
}, {
    timestamps: true
});

export default mongoose.model("Advertisement", advertisementSchema);
