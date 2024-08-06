const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // For parsing JSON payloads

// List of allowed origins
const allowedOrigins = ["https://www.omthakkar.site", "https://omthakkar.site"];

// CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        // Allow requests from the allowed origins
        callback(null, true);
      } else {
        // Reject requests from non-allowed origins
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Optional: if you need to allow credentials (cookies, authorization headers, etc.)
  })
);

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://om12899:vHtSIuJDOccdl1hC@cluster0.yja9wxl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

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
    const responses = await Form.find();
    res.status(200).json(responses);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving data.");
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
