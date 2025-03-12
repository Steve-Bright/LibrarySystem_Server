import bcrypt from "bcrypt";
import crypto from "node:crypto";
import path from "path"
import fs from "fs"
import jwt from "jsonwebtoken";
import {salt, secret_key} from "./swamhtet.js"

const inputString = 'swamhtetandchichi';
const encryptionKey = crypto.createHash('sha256').update(inputString).digest();
const IV_LENGTH = 16; // AES block size

export const fMsg = (res, msg, result = {}, statusCode = 200) => {
    return res.status(statusCode).json({ con: true, msg, result });
};

export const fError = (res, msg, statusCode = 500) => {
    return res.status(statusCode).json({ con: false, msg});
};

export const encode = (payload) => {
    return bcrypt.hashSync(payload, Number(salt))
}

export const decode = (payload, hash) => {
    return bcrypt.compareSync(payload, hash)
}

export const genToken = (payload) => {
    return jwt.sign(
        {
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
            data: payload, 
        },
        secret_key
    )
}

export const moveFile = (tempPath, finalPath) => {
    fs.rename(tempPath, finalPath, (error) => {
        if(error) return false;
    })
    return true;
}

export const deleteFile = (fileName) => {
    fs.unlink(fileName, (err) => {

        if (err) return false
    }); 
    return true
}

const today = new Date();
export const paginate = async (model, filter, page = 1, limit = 10, sortField = null, populate = []) => {
    try {
        // Calculate the number of documents to skip
        const skip = (page - 1) * limit;

        // Get total user count for pagination info
        const totalItems = await model.countDocuments(filter);

        // Calculate total pages based on total items
        const totalPages = Math.ceil(totalItems / limit);

        // Query to paginate items from the database
        let query = model.find(filter).skip(skip).limit(limit);

        if (sortField == 'dueDate') {
            query = query.sort({
                dueDate: 1
            });
        } else if (sortField) {
            query = query.sort({ [sortField]: -1 }); 
        }

        if (populate.length > 0) {
            populate.forEach(pop => {
                query = query.populate(pop);
            });
        }
        const items = await query.exec();

        return {
            items,
            totalItems,
            totalPages,
            currentPage: page,
        };
    } catch (error) {
        throw new Error("Error in pagination: " + error.message);
    }
};

export const todayDate = (nextDay = 0) => {
    let today = new Date();
    today.setDate(today.getDate() + nextDay)
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    today =  yyyy + "-" + mm + "-" + dd;
    return Date.parse(today);
}

export const nextYear = () => {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    yyyy = yyyy + 1;

    if(dd == "29" && mm == "2"){
        dd = 1
        mm = 3
    }

    let nextYear =  yyyy + "-" + mm + "-" + dd;
    return Date.parse(nextYear);
}

export const getAnotherMonth = (nextMonths = 1) => {
    let today = new Date();

    today.setMonth(today.getMonth() + nextMonths);

    // Format day, month, and year
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    let yyyy = today.getFullYear();

    return `${yyyy}-${mm}-${dd}`;
}

export const getWeeklyDates = ()=> {
    let today = new Date();
    today.setHours(0, 0, 0, 0)
    let todayDay = today.getDay()
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Friday", "Saturday"]
    let dateDifference = -1; //since the calculation will start once inside the loop
    for(let i = todayDay; i >=0 ; i--){
        dateDifference++;
    }

    let startOfWeek = new Date(today)
    let endOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - dateDifference)
    endOfWeek.setDate(startOfWeek.getDate() + 6)
    return {startOfWeek, endOfWeek}
}

export const getMonthlyDates = () => {
    let today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight

    // Start of the month
    let startOfMonth = new Date(today);
    startOfMonth.setDate(1); // Set the day to the first day of the month

    // End of the month
    let endOfMonth = new Date(today);
    endOfMonth.setMonth(today.getMonth() + 1); // Move to the next month
    endOfMonth.setDate(0); // Set the date to the last day of the previous month (end of the current month)

    return {startOfMonth, endOfMonth}
}

export function eData(text) {
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv('aes-256-cbc',Buffer.from(encryptionKey) , iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return  iv.toString('hex') + ':' + encrypted; // Store IV + encrypted data
}

// Decrypt function
export function dData(text) {
    console.log(text)
    let parts = text.split(':');
    let iv = parts[0];
    let encryptedText = Buffer.from(parts[1], "hex")
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(encryptionKey), Buffer.from(iv, "hex"));
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}
