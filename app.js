import "dotenv/config";
import express from "express";
import connectDB from "./db.config.js";
import userModel from "./user.model.js";

async function bootstrap() {
  await connectDB();
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get("/", (req, res) => {
    res.send("Hello World");
  });

  app.post("/users", async (req, res) => {
    const { name } = req.body;
    const user = await userModel.create({ name });
    res.status(201).json(user);
  });

  app.get("/users", async (req, res) => {
    const users = await userModel.find();
    res.status(200).json(users);
  });

  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
}

bootstrap();
