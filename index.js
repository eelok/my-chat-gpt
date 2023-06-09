const express = require('express');
const app = express();
const { openAPIconfig } = require('./openAIConfig');
require('dotenv').config();

let repository = [];
let counter = 0;

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

    counter++;
    repository.push({
      id: counter,
      question: prompt,
      answer: completion,
    });
    const message = repository[counter - 1];
    return res.status(200).send({
      success: true,
      message,
      // message: 'Hello I try to save your many',
    });
  } catch (err) {
    console.log(err.message);
  }
});

app.get('/conversation', (req, res) => {
  console.log('repository', repository);
  if (Object.keys(repository).length === 0) {
    return res.status(400).json({
      success: true,
      message: 'The conversation is empty :(',
    });
  }
  return res.status(200).send(repository);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
