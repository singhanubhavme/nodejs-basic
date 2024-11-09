import "dotenv/config";
import express from "express";
import connectDB from "./db.config.js";
import userModel from "./user.model.js";
import { createClient } from "redis";
import cors from "cors";

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));

async function bootstrap() {
  await connectDB();
  await redisClient.connect();

  const app = express();

  app.use(
    cors({
      origin: "*",
    })
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get("/", (req, res) => {
    res.send("Hello World");
  });

  app.post("/users", async (req, res) => {
    const { name } = req.body;
    const user = await userModel.create({ name });
    await redisClient.del("users");
    res.status(201).json(user);
  });

  app.get("/users", async (req, res) => {
    try {
      const cachedUsers = await redisClient.get("users");

      if (cachedUsers) {
        console.log("Fetching users from cache");
        return res.status(200).json(JSON.parse(cachedUsers));
      }

      const users = await userModel.find();
      await redisClient.set("users", JSON.stringify(users), {
        EX: 3600,
      });
      console.log("Fetching users from Database");

      res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
}

bootstrap().catch((error) => {
  console.error("Error starting the server:", error);
  redisClient.quit();
});
