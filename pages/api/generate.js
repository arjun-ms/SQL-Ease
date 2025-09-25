// import { Configuration, OpenAIApi } from 'openai';

// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// const openai = new OpenAIApi(configuration);

// const basePromptPrefix = "Write an SQL query for: ";
// const generateAction = async (req, res) => {
//   // Run first prompt
//   console.log(`API: ${basePromptPrefix}${req.body.userInput}`)

//   const baseCompletion = await openai.createCompletion({
//     model: 'text-davinci-003',
//     prompt: `${basePromptPrefix}${req.body.userInput}`,
//     temperature: 0.7,
//     max_tokens: 250,
//   });
  
//   const basePromptOutput = baseCompletion.data.choices.pop();

//   res.status(200).json({ output: basePromptOutput });
// };

// export default generateAction;



//================================= GROQ INFERENCE ================================



import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY, // keep this safe in .env.local
  baseURL: "https://api.groq.com/openai/v1",
});

const basePromptPrefix = `
Role: You are an expert SQL query writer with deep knowledge of relational databases.
Task: Given a natural language request, write a correct, optimized SQL query that fulfills the request. 
Context: Assume a generic SQL database (PostgreSQL-compatible). 
- Do not include explanations, comments, or extra text.
- Only return the SQL query as plain text.
Request: 
`;

const generateAction = async (req, res) => {
  try {
    console.log(`API: ${basePromptPrefix}${req.body.userInput}`);

    const response = await client.responses.create({
      // model: "mixtral-8x7b-instruct", // Groq recommends Mixtral for SQL/text
      model: "openai/gpt-oss-120b", // gpt oss model
      input: `${basePromptPrefix}${req.body.userInput}`,
      temperature: 0.8,
      max_output_tokens: 250,
    });

    // response.output is an array of structured outputs, easier to flatten:
    const outputText = response.output_text;

    res.status(200).json({ output: outputText });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong." });
  }
};

export default generateAction;
