const express = require('express');
const app = express();
const { openAPIconfig } = require('./openAIConfig');
require('dotenv').config();
var crypto = require('crypto');

let repository = {};

function addToRepository({ question, answer }) {}

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(express.json());

const port = process.env.PORT || 5500;

app.post('/ask', async (req, res) => {
  let prompt = req.body.prompt;
  prompt = prompt.trim();
  try {
    if (!prompt) {
      throw new Error('Uh oh, no prompt was provided');
    }
    let openAI = await openAPIconfig();
    const responseBot = await openAI.createCompletion({
      model: 'text-davinci-003',
      prompt,
      temperature: 0.6,
    });
    const completion = responseBot.data.choices[0].text;

    const id = crypto.randomBytes(16).toString('hex');
    repository[id] = {
      question: prompt,
      answer: completion,
    };
    return res.status(200).json({
      success: true,
      object: repository[id],
    });
    return res.status(200).json({
      success: true,
      // message: 'Hello I try to save your many',
      message: repository[id],
    });
  } catch (err) {
    console.log(err.message);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
