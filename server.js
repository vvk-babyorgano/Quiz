// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');

// Initialize express app
const app = express();

// Use express.json() middleware to parse JSON request bodies
app.use(express.json());

// Define file paths
const quizDataFilePath = path.join(__dirname, 'models', 'quizData.json');
const responsesFilePath = path.join(__dirname, 'models', 'quiz-responses.json');

// Serve static files (HTML, CSS, JS) from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// API Endpoint: Get quiz questions (GET request)
app.get('/api/quiz', (req, res) => {
  fs.readFile(quizDataFilePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading quiz data');
      return;
    }
    res.json(JSON.parse(data));
  });
});

// API Endpoint: Save quiz responses (POST request)
app.post('/api/quiz-responses', (req, res) => {
  const responseData = req.body;

  // Validate the incoming data
  if (!Array.isArray(responseData) || responseData.length === 0) {
    res.status(400).send('Invalid quiz response data');
    return;
  }

  // Save the responses to the file
  fs.readFile(responsesFilePath, 'utf8', (err, data) => {
    let responses = [];

    // Read existing responses if the file exists
    if (!err && data) {
      responses = JSON.parse(data);
    }

    // Add new response
    responses.push(responseData);

    // Write updated responses to the file
    fs.writeFile(responsesFilePath, JSON.stringify(responses, null, 3), 'utf8', (writeErr) => {
      if (writeErr) {
        res.status(500).send('Error saving response');
        return;
      }
      res.status(201).send('Response saved successfully');
    });
  });
});

// Start the server on a specific port (3000)
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
