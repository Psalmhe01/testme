import {User} from "../Models\User.js";
import bcrypt from "bcrypt";

exports.showRegisterForm = (req, res) => {
    res.render("register");
}

exports.showLoginForm = (req, res) => {
    res.render("login");
}

exports.registerUser =  async(req, res) => {
    try {
        const { username, password } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);

        const user = await User.create({ username, passwordHash });
        req.session.userId = user._id;

        res.redirect("/dashboard");


    } catch (error) {
        if (error.code === 11000) {
            return res.render("register", { error: "Username already exists" });
        }
        res.render("register", { error: error.message });
    
    }
}

exports.loginUser = async(req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.render("login", { error: "Invalid username or password" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid){
            return res.render("login", { error: "Invalid username or password" });
            res.redirect("/login");
        }

        res.session.userId = user._id;
        res.redirect("/dashboard");
    
    } catch (error) {
        res.render("login", { error: error.message });
    }
}

exports.logoutUser = async(req, res) => {
    res.session.destroy(() => {
        res.render("logout",{ message: "User logged out successfully" });
    });
    res.redirect("/login");
};
