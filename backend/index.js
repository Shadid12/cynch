// app.js or server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

app.post('/sentiment', async (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ error: 'Text is required' });
    }

    try {
        const sentiment = analyzeSentiment(text);
        const id = await insertSentiment(text, sentiment);
        res.json({ id, sentiment });
    } catch (err) {
        res.status(500).json({ error: 'Failed to save data to the database' });
    }
});

function analyzeSentiment(text) {
  const sentiments = ['positive', 'negative', 'neutral'];
  const randomIndex = Math.floor(Math.random() * sentiments.length);
  return sentiments[randomIndex];
}

const insertSentiment = (text, sentiment) => {
  return new Promise((resolve, reject) => {
      db.run('INSERT INTO sentiments (text, sentiment) VALUES (?, ?)', [text, sentiment], function(err) {
          if (err) {
              return reject(err);
          }
          resolve(this.lastID);
      });
  });
};

module.exports = app;

// If you're using this as the main server file, you can start the server like this:
if (require.main === module) {
  app.listen(port, () => {
      console.log(`Server running on port ${port}`);
  });
}
