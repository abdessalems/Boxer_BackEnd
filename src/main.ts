import express from "express";
import bodyParser from "body-parser";
import mariadb from "mariadb";
import { Boxer } from "./model/boxer";

const pool = mariadb.createPool({
  host: "localhost",
  user: "boxer",
  password: "1234",
  database: "boxer_db",
  connectionLimit: 5,
});

const app = express();
app.use(bodyParser.json());

const boxers: Boxer[] = [
  {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    password: "password123",
    height: "180 cm",
    weight: "75 kg",
    fightNumber: "20",
    win: "15",
    losses: "5",
    kos: "10",
    gymNumber: "123",
    title: "World Champion",
    imageLink: "https://example.com/john_doe.jpg",
    trainerName: "Mike Trainer",
  },
];

// API endpoint to register a boxer
app.post("/api/register", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      height,
      weight,
      fightNumber,
      win,
      losses,
      kos,
      gymNumber,
      title,
      imageLink,
      trainerName,
    } = req.body;

    const connection = await pool.getConnection();

    // Check if the email is already registered
    const existingBoxer = await connection.query(
      "SELECT * FROM Boxers WHERE email = ?",
      [email]
    );

    if (existingBoxer.length > 0) {
      connection.end();
      return res.status(400).json({ message: "Email is already registered." });
    }

    // Insert new boxer
    await connection.query(
      "INSERT INTO Boxers (firstName, lastName, email, password, height, weight, fightNumber, win, losses, kos, gymNumber, title, imageLink, trainerName) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        firstName,
        lastName,
        email,
        password,
        height,
        weight,
        fightNumber,
        win,
        losses,
        kos,
        gymNumber,
        title,
        imageLink,
        trainerName,
      ]
    );

    connection.end();
    res.status(201).json({ message: "Boxer registered successfully." });
  } catch (error) {
    console.error("Error registering boxer:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});