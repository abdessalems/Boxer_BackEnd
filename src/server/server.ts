import express from "express";
import bodyParser from "body-parser";
import mariadb from "mariadb";

const pool = mariadb.createPool({
  host: "localhost",
  user: "boxer",
  password: "1234",
  database: "boxer_db",
  connectionLimit: 5,
});

const app = express();
app.use(bodyParser.json());

// API endpoint to register a boxer
app.post("/api/add", async (req, res) => {
    try {
      console.log("Received POST request:", req.body);
  
      const {
        firstName,
        lastName,
        email,
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
  
      const existingBoxer = await pool.query(
        "SELECT * FROM Boxers WHERE email = ?",
        [email]
      );
  
      if (existingBoxer.length > 0) {
        return res.status(400).json({ message: "Email is already registered." });
      }
  
      await pool.query(
        "INSERT INTO Boxers (firstName, lastName, email, height, weight, fightNumber, win, losses, kos, gymNumber, title, imageLink, trainerName) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          firstName,
          lastName,
          email,
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
  
      res.status(201).json({ message: "Boxer registered successfully." });
    } catch (error) {
      console.error("Error registering boxer:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  });

// API endpoint to get all boxers
app.get("/api/boxers", async (req, res) => {
  try {
    const allBoxers = await pool.query("SELECT * FROM Boxers");
    res.status(200).json(allBoxers);
  } catch (error) {
    console.error("Error getting boxers:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// API endpoint to update a boxer by ID
app.put("/api/boxers/:id", async (req, res) => {
  try {
    const boxerId = req.params.id;
    const updatedBoxer = req.body;

    await pool.query(
      "UPDATE Boxers SET firstName = ?, lastName = ?, email = ?, height = ?, weight = ?, fightNumber = ?, win = ?, losses = ?, kos = ?, gymNumber = ?, title = ?, imageLink = ?, trainerName = ? WHERE id = ?",
      [
        updatedBoxer.firstName,
        updatedBoxer.lastName,
        updatedBoxer.email,
        updatedBoxer.height,
        updatedBoxer.weight,
        updatedBoxer.fightNumber,
        updatedBoxer.win,
        updatedBoxer.losses,
        updatedBoxer.kos,
        updatedBoxer.gymNumber,
        updatedBoxer.title,
        updatedBoxer.imageLink,
        updatedBoxer.trainerName,
        boxerId,
      ]
    );

    res.status(200).json({ message: "Boxer updated successfully." });
  } catch (error) {
    console.error("Error updating boxer:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// API endpoint to delete a boxer by ID
app.delete("/api/boxers/:id", async (req, res) => {
  try {
    const boxerId = req.params.id;

    await pool.query("DELETE FROM Boxers WHERE id = ?", [boxerId]);

    res.status(200).json({ message: "Boxer deleted successfully." });
  } catch (error) {
    console.error("Error deleting boxer:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// API endpoint to get a boxer by ID
app.get("/api/boxers/:id", async (req, res) => {
    try {
      const boxerId = req.params.id;
  
      const boxer = await pool.query("SELECT * FROM Boxers WHERE id = ?", [boxerId]);
  
      if (boxer.length === 0) {
        return res.status(404).json({ message: "Boxer not found." });
      }
  
      res.status(200).json(boxer[0]);
    } catch (error) {
      console.error("Error getting boxer by ID:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  });
  

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
