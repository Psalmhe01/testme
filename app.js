import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import MongoStore from "connect-mongo";
import session from "express-session";

import DatabaseConnection from "./Models/DatabaseConnection.js";
import dashboardRoutes from "./others/Routes/dashboard.js";
import topicRoutes from "./others/Routes/topics.js";
import messageRoutes from "./others/Routes/messages.js";

import "./others/observers/appFeedUpdater.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("views", path.join(process.cwd(), "Views"));
app.set("view engine", "ejs");

if (!process.env.MONGODB_URL) {
  console.error("FATAL ERROR: MONGODB_URL is not defined in .env file.");
  process.exit(1);
}

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

app.use((req, res, next) => {
  res.locals.error = null;
  res.locals.username = "";
  next();
});

app.use("/", dashboardRoutes);
app.use("/", topicRoutes);
app.use("/", messageRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server started at http://localhost:" + port);
});
