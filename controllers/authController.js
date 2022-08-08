import Users from "../models/User.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

const authController = {
  register: async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password)
      return res
        .status(400)
        .json({ success: false, message: "Missing username or password!" });

    try {
      //kiem tra username da co trong db chua :D
      const user = await Users.findOne({ username });

      if (user)
        return res
          .status(400)
          .json({ success: false, message: "Username already taken" });

      //hash password
      const hashPassword = await argon2.hash(password);

      //create new user
      const newUser = new Users({ username, password: hashPassword });
      await newUser.save();

      //create token
      const accessToken = jwt.sign(
        { userId: newUser._id },
        process.env.ACCESS_TOKEN_SECERT
      );

      return res
        .status(201)
        .json({ success: true, message: "Register success", accessToken });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },
  login: async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password)
      return res
        .status(400)
        .json({ success: false, message: "Missing username or password!" });

    try {
      const user = await Users.findOne({ username });

      if (!user)
        return res
          .status(400)
          .json({ success: false, message: "Incorrect username or passwrod!" });

      const passwordValid = await argon2.verify(user.password, password);

      if (!passwordValid)
        return res
          .status(400)
          .json({ success: false, message: "Incorrect username or passwrod!" });

      //all good

      //create token
      const accessToken = jwt.sign(
        { userId: user._id },
        process.env.ACCESS_TOKEN_SECERT
      );

      return res
        .status(200)
        .json({ success: true, message: "Login success", accessToken });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },
  getUser: async (req, res) => {
    try {
      const user = await Users.findById(req.user.userId);

      if (!user)
        return res
          .status(400)
          .json({ success: false, message: "User not found" });

      return res.json({ success: true, user });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },
};

export default authController;
