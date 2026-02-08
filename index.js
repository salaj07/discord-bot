require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const { GoogleGenAI } = require("@google/genai");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, // this is for the bot to know about the servers it is in
    GatewayIntentBits.GuildMessages, // tis is for the bot to know about the messages sent in the servers it is in
    GatewayIntentBits.MessageContent, // this is for the bot to know about the content of the messages sent in the servers it is in
  ],
});

client.once("ready", () => {
  console.log("Bot is online!");
});

const genai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function generateContent(prompt) {
  try {
    const response = await genai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,

      config: {
        systemInstruction:
          "generate the response in 100 words and make it concise and to the point",
        /*  systemInstruction:{
                role:"system",
                parts:[
                    {text:"generate the response in 100 words and make it concise and to the point"}
                ]
            } */
      },
    });
    // console.log(response.text);

    return response;
  } catch (error) {
    console.error("Error generating content:", error);
    return null;
  }
}

client.on("messageCreate", async (message) => {
  if (message.author.bot) return; // this is to prevent the bot from replying to itself or other bots

  const prefix = "jarvis"; // prefix jarvis is used to trigger the bot, you can change it to anything you want
  if (!message.content.toLowerCase().startsWith(prefix)) return;

  const prompt = message.content;
//   console.log(prompt);

  const generatedContent = await generateContent(prompt);
  // console.log(generatedContent);
  if (generatedContent) {
    message.reply(generatedContent.text);
  } else {
    message.reply("Sorry, I could not generate a response at this time.");
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
