const express = require('express');
const app = express();
const { openAPIconfig } = require('./openAIConfig');
require('dotenv').config();
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
    return res.status(200).json({
      success: true,
      message: completion,
    });
  } catch (err) {
    console.log(err.message);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
