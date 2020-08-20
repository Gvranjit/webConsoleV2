const jwt = require("jsonwebtoken");
const User = require("../models/user");
module.exports = (req, res, next) => {
     //check if incoming request has a token attached.

     const token = req.cookies.JWT;
     console.log(token);
     if (!token) {
          const error = new Error("Not authenticated");
          error.statusCode = 401;
          throw error;
     }

     //decode the token and check if valid.
     let decodedToken;
     try {
          decodedToken = jwt.verify(token, "cnobimyktm123$");
     } catch (err) {
          err.statusCode = 401;
          throw err;
     }
     console.log(decodedToken);
     //check if admin
     if (!decodedToken.admin) {
          const error = new Error("Forbidden");
          error.statusCode = 403;
          throw error;
     }
     req.isLoggedIn = true;
     req.username = decodedToken.nickName;
     res.locals.isLoggedIn = true;
     res.locals.username = decodedToken.nickName;

     //forward the connectoin
     next();
};
