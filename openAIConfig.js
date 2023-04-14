const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

function openAPIconfig() {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  return new OpenAIApi(configuration);
}

module.exports = {
  openAPIconfig,
};
