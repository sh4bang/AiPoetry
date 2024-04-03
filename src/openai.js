//import OpenAI from "openai";
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generatePoem = async (titles) => {

    const listOfTitles = titles.map((item) => {
        return "- " + item;
    }).join('\n');

    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                "role": "system",
                "content": "Tu es un poète.\nJe vais te fournir une liste de titres de news provenant du journal \"Le Monde\".\nTu devras générer un magnifique poème de deux strophes inspiré des titres que je te fournis."
            },
            {
              "role": "assistant",
              "content": "Bien sûr, envoie-moi la liste de titres et je tâcherai de composer un poème à partir de ces inspirations."
            },
            {
                "role": "user",
                "content": listOfTitles
            }
        ],
        temperature: 1,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0.5,
        presence_penalty: 0.5
    });

    return completion.choices[0];
}

module.exports = generatePoem;