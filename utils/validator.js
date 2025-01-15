import jwt from "jsonwebtoken";
import { secret_key } from "./swamhtet.js";

export let validateToken = () => {
    return async (req, res, next) => {
      if (!req.headers.authorization) {
        return next(new Error("Unauthorized"));
      }
  
      let token = req.headers.authorization.split(" ")[1];
      // console.log(token);
      try {
        const tokenUser = jwt.verify(token, secret_key);
        req.user = tokenUser.data;
  
        next();
      } catch (error) {
        return next(new Error("Invalid token"));
      }
    };
  };

  export const validateBody = (schema) => {
    return (req, res, next) => {
      const options = {
        errors: {
          wrap: {
            label: false
          }
        }
      };
      let result = schema.validate(req.body, options);
  
      if (result.error) {
        next(new Error(result.error.details[0].message));
      } else {
        next();
      }
    };
  };
  

  export const isRoot = () => {
    return (req, res, next) => {
        const role = req.user.role;
        if(role != "root"){
            return next(new Error("You don't have permission to do so"))
        }
    }
  }

  export const isManager = () => {
    return (req, res, next) => {
      const role = req.user.role;
      if (role != "manager" && role !="root") {
        return next(new Error("You are not a library manager"));
      }
      next();
    };
  };