const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");

require("dotenv").config();
const app = express();

// List of allowed origins
const allowedOrigins = [
  "http://localhost:5173", // Replace with your frontend URLs
  "https://omthakkar.site",
  "https://www.omthakkar.site",
];

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // For parsing JSON payloads

// CORS Configuration
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected to MongoDB");
});

// Define Schema and Model with `submittedDate`
const formSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  subject: String,
  content: String,
  submittedDate: { type: Date, default: Date.now }, // Added field
});

const Form = mongoose.model("Form", formSchema);

// POST endpoint to submit form data
app.post("/submit", async (req, res) => {
  try {
    const formData = new Form({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      subject: req.body.subject,
      content: req.body.content,
    });

    await formData.save();
    res.status(200).send("Data saved successfully.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving data.");
  }
});

// GET endpoint to retrieve all form submissions
app.get("/responses", async (req, res) => {
  try {
    const responses = await Form.find().sort({ submittedDate: -1 });
    res.status(200).json(responses);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving data.");
  }
});

app.post("/check-password", (req, res) => {
  const { password } = req.body;

  if (password === process.env.LOGIN_KEY) {
    // Create a JWT token
    const token = jwt.sign(
      { user: "authenticatedUser" },
      process.env.LOGIN_KEY,
      { expiresIn: "1h" }
    );

    return res.status(200).json({ message: "Password is correct!", token });
  } else {
    return res.status(400).json({ message: "Password is incorrect!" });
  }
});

// Test endpoint
app.get("/test", (req, res) => {
  res.json({ status: true });
});

// Start server
if (require.main === module) {
  app.listen(9000, () => {
    console.log("Server is running on port 9000");
  });
}

module.exports = app;
