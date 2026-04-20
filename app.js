import dotenv from "dotenv";
dotenv.config();

import express from "express";
import MongoStore from "connect-mongo";
import session from "express-session";

import DatabaseConnection from "./Models/DatabaseConnection.js";
import indexRoutes from "./others/Routes/index.js";

const app = express();

// 1. Essential Middleware (Parsers and Statics should come before Routes)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));


// 2. Environment Validation
if (!process.env.MONGODB_URL) {
  console.error("FATAL ERROR: MONGODB_URL is not defined in .env file.");
  process.exit(1);
}

// 3. Initialize Database
DatabaseConnection.getInstance(process.env.MONGODB_URL);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URL,
    }),
  }),
);

// 4. Routes
app.use("/", indexRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server started at http://localhost:" + port);
});
