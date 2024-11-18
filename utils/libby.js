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
