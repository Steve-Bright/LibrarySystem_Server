import mongoose from "mongoose";

const deletedbookSchema = new mongoose.Schema({
    category: {
        type: String, 
        required: true,
        index: true
    },
    accNo: {
        type: String,
        required: true,
        index: true,
    },
})

const deletedbook = mongoose.model("deletedbook", deletedbookSchema)
export default deletedbook