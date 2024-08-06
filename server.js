const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Add this line if sending JSON payloads

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

// Define Schema and Model
const formSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  subject: String,
  content: String,
});

const Form = mongoose.model("Form", formSchema);

// Routes
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

// Start server
app.listen(9000, () => {
  console.log("Server is running on port 9000");
});
