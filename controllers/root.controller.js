import User from "../model/user.model.js";
import {encode, fError, fMsg } from "../utils/libby.js";

export const register = async (req, res) => {
    try{
        let{ userName, email, password, role } = req.body;
        if(!userName || !email || !password || !role){
            return fError(res, "All fields are required", 400);
        }
        let userExists = await User.findOne({ userName, email });
        if(userExists){
            return fError(res, "User already exists", 400);
        }

        const passwordHash = encode(password);
        let user = await User.create({ userName, email, password: passwordHash, role: role });
        return fMsg(res, "User created successfully", user, 201);

    }catch(error){
        console.log(error);
        return fError(res, error.message, 500);
    }
}