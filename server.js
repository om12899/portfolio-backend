const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  cors({
    origin: "*", // Allow all origins for testing purposes
  })
);

mongoose
  .connect(
    "mongodb+srv://your-username:your-password@cluster0.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

const formSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  subject: String,
  content: String,
  submittedDate: { type: Date, default: Date.now },
});

const Form = mongoose.model("Form", formSchema);

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
    console.error("Error saving data:", err);
    res.status(500).send("Error saving data.");
  }
});

app.get("/responses", async (req, res) => {
  try {
    const responses = await Form.find();
    res.status(200).json(responses);
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).send("Error retrieving data.");
  }
});

app.get("/test", (req, res) => {
  res.json({ status: true });
});

module.exports = app;
