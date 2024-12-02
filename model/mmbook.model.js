import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    category: {
        type: String,
        default: "myanmar"
    },
    accNo: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    bookTitle: {
        type: String,
        required: true,
        index: true
    },
    subTitle: {
        type: String,
    },
    parallelTitle: {
        type: String
    },
    initial: {
        type: String,
        required: true
    },
    classNo: {
        type: Number,
        required: true,
        index: true
    },
    callNo: {
        type: String,
        required: true,
        unique: true
    },
    bookCover: {
        type: String, 
        required: true
    },
    sor: {
        type: String,
        required: true
    },
    authorOne: {
        type: String
    },
    authorTwo: {
        type: String
    }, 
    authorThree: {
        type: String
    }, 
    other: {
        type: String
    },
    translator: {
        type: String
    },
    pagniation: {
        type: String
    },
    size: {
        type: Number
    },
    illustrationType: {
        type: String
    },
    seriesTitle: {
        type: String
    },
    seriesNo: {
        type: String
    },
    includeCD: {
        type: String
    },
    subjectHeadings: {
        type: String
    },
    edition: {
        type: Number
    },
    editor: {
        type: String
    },
    place: {
        type: String
    },
    publisher: {
        type: String
    },
    year: {
        type: Number
    },
    keywords: {
        type: String
    },
    summary: {
        type: String
    },
    notes: {
        type: String
    },
    source: {
        type: String
    },
    price: {
        type: Number
    },
    donor: {
        type: String
    }, 
    catalogOwner: {
        type: String
    },
    barcode: {
        type: String
    }
    
});

const mmbook = mongoose.model("mmbook", bookSchema);

export default mmbook;