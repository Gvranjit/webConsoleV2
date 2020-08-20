const jwt = require("jsonwebtoken");
const validator = require("validator").default;
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { hasHook } = require("../utils/database");
const flash = require("flash");
const UUID = require("uuid");
const cookieParser = require("cookie-parser");

exports.postRegister = async (req, res, next) => {
     try {
          console.log(req.body);
          //read the request
          //check if body is empty
          if (!req.body) {
               const error = new Error("Something went wrong with the request body");
               throw error;
          }

          const email = req.body.email;
          const password = req.body.password;
          const fname = req.body.fname;
          const lname = req.body.lname;
          const nickName = req.body.nickName;

          //validate the email and passwords

          if (
               validator.isEmpty(email) ||
               validator.isEmpty(password) ||
               validator.isEmpty(fname) ||
               validator.isEmpty(lname) ||
               validator.isEmpty(nickName)
          ) {
               const error = new Error("Please don't leave any fields empty.");
               throw error;
          }
          if (!validator.isEmail(email)) {
               const error = new Error("Must type in a valid email address");
               throw error;
          }

          //check if email already exists
          const existingUser = await User.findOne({ where: { email: email } });
          if (existingUser) {
               const error = new Error("User already Exists");
               throw error;
          }
          //encrypt the password using bcrypt
          const encryptedPassword = await bcrypt.hash(password, 12);

          //create new user using the given details
          const newUser = new User({
               id: UUID.v4(),
               firstName: fname,
               lastName: lname,
               nickName: nickName,
               email: email,
               password: encryptedPassword,
          });
          //save user.

          await newUser.save();

          return res.redirect("/auth/login");
     } catch (err) {
          next(err);
     }
};
exports.getLogin = (req, res, next) => {
     res.render("./auth/login.ejs", {
          title: "Login",
     });
};

exports.postLogin = async (req, res, next) => {
     console.log("testing", req.body);
     //receive a json format body\

     const value = req.body;
     //add validation
     try {
          const email = req.body.email;
          const password = req.body.password;

          if (!validator.isEmail(value.email)) {
               const error = new Error("Please enter a valid Email address. ");
               error.statusCode = 400;
               throw error;
          }

          //check the username and password

          const user = await User.findOne({
               where: {
                    email: req.body.email,
               },
          });

          if (!user) {
               const error = new Error("User doesn't exist");
               error.statusCode = 400;
               throw error;
          }
          if (!user.admin) {
               const error = new Error("User isn't an admin");
               error.statusCode = 400;
               throw error;
          }

          //compare the passowrd with hashedPassword in database

          const authenticated = await bcrypt.compare(password, user.password);

          if (!authenticated) {
               const error = new Error("Incorrect Password");
               error.statusCode = 400;
               throw error;
          }

          //assign jwt and send it back as a response.

          const token = jwt.sign(
               {
                    email: user.email,
                    admin: "true",
                    nickName: user.nickName,
               },
               "cnobimyktm123$",
               { expiresIn: "100m" }
          );
          console.log(token);

          res.cookie("JWT", token, {
               maxAge: 1000 * 60 * 60,
               httpOnly: true,
          });
          return res.redirect("/");
     } catch (error) {
          next(error);
     }
};
exports.getLogout = (req, res, next) => {
     //receive a json format body, and parse it.

     const token = jwt.sign({ value: "somerandompayload" }, "cnobimyktm123$", { expiresIn: 0 });
     res.cookie("JWT", token, {
          expiresIn: 0,
     });

     res.redirect("/");
};
