import jwt from "jsonwebtoken";

export let validateToken = () => {
    return async (req, res, next) => {
      if (!req.headers.authorization) {
        return next(new Error("Unauthorized"));
      }
  
      let token = req.headers.authorization.split(" ")[1];
      // console.log(token);
      try {
        const tokenUser = jwt.verify(token, process.env.SECRET_KEY);
        req.user = tokenUser.data;
  
        next();
      } catch (error) {
        return next(new Error("Invalid token"));
      }
    };
  };

  export const validateBody = (schema) => {
    return (req, res, next) => {
      console.log("does validate body work?")
      let result = schema.validate(req.body);
  
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