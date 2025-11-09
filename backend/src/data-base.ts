import mongoose from "mongoose";

export class MongoDbLibrary {
  private static isConnected = false;

  constructor() {
    process.on("SIGINT", async () => {
      if (MongoDbLibrary.isConnected) {
        console.log("Disconnecting database...");
        await mongoose.disconnect();
        console.log("Database disconnected");
        MongoDbLibrary.isConnected = false;
      }
      process.exit(0);
    });
  }

  public async makeConnection() {
    if (MongoDbLibrary.isConnected) {
      return mongoose;
    }

    const url = this.getConnectionString();

    try {
      console.log("Connecting to DB...");
      await mongoose.connect(url);
      MongoDbLibrary.isConnected = true;
      console.log("Connected to DB");
      return mongoose;
    } catch (err) {
      console.error("MongoDB connection error:", err);
      throw err;
    }
  }

  private getConnectionString(): string {
    return [
      "mongodb+srv://",
      process.env.DB_NAME,
      ":",
      process.env.DB_PASSWORD,
      "@cluster0.6mucphx.mongodb.net/",
      "staging",
    ].join("");
  }
}
