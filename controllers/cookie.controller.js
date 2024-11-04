import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { fError, fMsg} from "../utils/libby.js";


dotenv.config();

export const cookieCheckController = (req, res, next) => {
    if(!req.cookies){
        return fError(res, "Unauthorised", 401)
    }

    const { token } = req.cookies;
    if (!token) {
        return fError(res, "Unauthorised", 401)
        // return res.status(401).json({ message: "Unauthorized" });
    }
    const tokenUser = jwt.verify(token, process.env.SECRET_KEY);
    // return res.status(200).json({ message: "Authorized", userData: tokenUser.data, token });
    return fError(res, "Authorised", {tokenUser, token}, 200)
}