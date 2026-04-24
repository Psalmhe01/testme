import { User } from "../Models/User.js";
import bcrypt from "bcrypt";

export const showRegisterForm = (req, res) => {
  res.render("register", { error: null, username: "" });
};

export const showLoginForm = (req, res) => {
  res.render("login", { error: null, username: "" });
};

export const registerUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({ username, passwordHash: passwordHash });
    req.session.userId = user._id;

    res.redirect("/dashboard");
  } catch (error) {
    const errorMessage =
      error.code === 11000 ? "Username already exists" : error.message;
    res.render("register", { error: errorMessage, username });
  }
};

export const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.render("login", { error: "User not found!", username });
    }
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.render("login", {
        error: "Invalid username or password!",
        username,
      });
    }

    req.session.userId = user._id;
    res.redirect("/dashboard");
  } catch (error) {
    res.render("login", { error: error.message, username });
  }
};

export const logoutUser = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};
