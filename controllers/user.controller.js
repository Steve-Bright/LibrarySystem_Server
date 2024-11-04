import User from "../model/user.model.js";
import { decode, fError, fMsg , genToken} from "../utils/libby.js";

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

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,  // Secure should be true in production (HTTPS)
            sameSite: 'lax',  // Required for cross-site requests when using credentials
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        return fMsg(res, "Login successful", { token, userData }, 200);
    }catch(error){
        console.log(error);
        return fError(res, error.message, 500);
    }
}