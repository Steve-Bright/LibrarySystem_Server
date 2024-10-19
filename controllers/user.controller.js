import User from "../model/user.model.js";
import { encode, decode, fError, fMsg , genToken} from "../utils/libby.js";

export const register = async (req, res) => {
    try{
        let{ userName, email, password } = req.body;
        if(!userName || !email || !password){
            return fError(res, "All fields are required", 400);
        }
        let userExists = await User.findOne({ userName, email });
        if(userExists){
            return fError(res, "User already exists", 400);
        }

        const passwordHash = encode(password);
        let user = await User.create({ userName, email, password: passwordHash });
        return fMsg(res, "User created successfully", user, 201);

    }catch(error){
        console.log(error);
        return fError(res, error.message, 500);
    }
}

export const login = async (req, res) => {
    try{
        let{ email, password } = req.body;
        if(!email || !password){
            return fError(res, "All fields are required", 400);
        }
        let user = await User.findOne({ email });
        if(!user){
            return fError(res, "Invalid credentials", 400);
        }

        let passwordMatch = decode(password, user.password);
        if(!passwordMatch){
            return fError(res, "Invalid credentials", 400);
        }

        const toEncrypt = {
            id: user._id,
            userName: user.userName,
            email: user.email
        }

        const { password: _, ...userData } = user.toObject();


        const token = genToken(toEncrypt);

        return fMsg(res, "Login successful", { token, userData }, 200);
    }catch(error){
        console.log(error);
        return fError(res, error.message, 500);
    }
}