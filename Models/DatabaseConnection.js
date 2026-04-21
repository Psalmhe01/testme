import { MongoClient } from "mongodb";
import mongoose from "mongoose";

export default class DatabaseConnection {
  static instance;
  db = null;

  constructor(uri) {
    this.uri = uri;
  }

  static getInstance(uri) {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection(uri);
      DatabaseConnection.instance._connect();
    }
    return DatabaseConnection.instance;
  }

  async _connect() {
    try {
      if (
        !this.uri ||
        (!this.uri.startsWith("mongodb://") &&
          !this.uri.startsWith("mongodb+srv://"))
      ) {
        throw new Error(
          "Invalid MongoDB Connection String. Check your .env file.",
        );
      }

      const client = new MongoClient(this.uri);

      // Initialize Mongoose connection for your Models
      await mongoose.connect(this.uri);

      await client.connect();
      this.db = client.db();
      console.log("Connected to Database using singleton pattern");
      return this.db;
    } catch (error) {
      console.error("Connection error", error);
      throw error;
    }
  }
}
