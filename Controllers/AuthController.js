import { User } from "../Models/User.js";
import bcrypt from "bcrypt";

export const showRegisterForm = (req, res) => {
  res.render("register");
};

export const showLoginForm = (req, res) => {
  res.render("login");
};

export const registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({ username, passwordHash: passwordHash });
    req.session.userId = user._id;

    res.redirect("/dashboard");
  } catch (error) {
    if (error.code === 11000) {
      return res.render("register", { error: "Username already exists" });
    }
    res.render("register", { error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.render("login", { error: "User not found!" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.render("login", { error: "Invalid username or password!" });
      res.redirect("/login");
    }

    req.session.userId = user._id;
    res.redirect("/dashboard");
  } catch (error) {
    res.render("login", { error: error.message });
  }
};

export const logoutUser = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};
