import mongoose from "mongoose";

const messageSchema = mongoose.Schema({
    username: String,
    text: String,
    timestamp: {
        type: Date,
        default: Date.now()
    }
})

export default mongoose.model('Message', messageSchema)