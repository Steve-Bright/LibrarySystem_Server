import bcrypt from "bcrypt";
import path from "path"
import fs from "fs"
import jwt from "jsonwebtoken";

export const fMsg = (res, msg, result = {}, statusCode = 200) => {
    return res.status(statusCode).json({ con: true, msg, result });
};

export const fError = (res, msg, statusCode = 500) => {
    return res.status(statusCode).json({ con: false, msg});
};

export const encode = (payload) => {
    return bcrypt.hashSync(payload, Number(process.env.SALT))
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
        process.env.SECRET_KEY
    )
}

export const moveImage = (tempPath, finalPath) => {
    console.log("This is new path " + finalPath)
    fs.rename(tempPath, finalPath, (error) => {
        console.log("moving image error " + error)
        return false;
    })
    return true;
}

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

        if (sortField) {
            query = query.sort({ [sortField]: -1 }); // Sort by the provided field (descending)
        }

        // Apply populate if provided
        if (populate.length > 0) {
            populate.forEach(pop => {
                query = query.populate(pop);
            });
        }

        // Execute the query and get the items
        const items = await query;

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