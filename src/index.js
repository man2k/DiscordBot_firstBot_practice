import { Client, GatewayIntentBits } from "discord.js";
import * as dotenv from "dotenv";
import { REST, Routes } from "discord.js";
import axios from "axios";

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const rest = new REST({ version: "10" }).setToken(process.env.DISC_TOKEN);

client.login(process.env.DISC_TOKEN);

client.on("ready", () => {
  console.log("Bot has Logged-in as", client.user.tag);
});

client.on("messageCreate", (message) => {
  console.log(message.content, "   ||  ", message.createdAt.toDateString());
  //   console.log(message.createdAt.toDateString());
  //   console.log(message.guildId);
});
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "ping") {
    // await interaction.reply("Pong!");
    await interaction.reply(
      "https://media4.giphy.com/media/26BoEeFJkz2eZUBcQ/giphy.gif?cid=ecf05e47d55n8ia84xuwc93rgbwwt6eaic8ahv1x15d6xvai&ep=v1_gifs_search&rid=giphy.gif&ct=g"
    );
  }
  if (interaction.commandName === "translate") {
    console.log(interaction.options.data);
    const encodedParams = new URLSearchParams();
    encodedParams.set("q", interaction.options.getString("text"));
    encodedParams.set("target", interaction.options.getString("translateto"));
    encodedParams.set("source", interaction.options.getString("inputlanguage"));

    const options = {
      method: "POST",
      url: "https://google-translate1.p.rapidapi.com/language/translate/v2",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "Accept-Encoding": "application/gzip",
        "X-RapidAPI-Key": "6f36b8407fmsh5482f70a37c0fdap1d16c3jsn3b8ecac16907",
        "X-RapidAPI-Host": "google-translate1.p.rapidapi.com",
      },
      data: encodedParams,
    };

    try {
      const response = await axios.request(options);
      //   console.log(response.data.data);
      await interaction.reply({
        content: response.data.data.translations[0].translatedText,
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "Translation failed!",
      });
    }
  }
  if (interaction.commandName === "com2") {
    await interaction.reply({ content: "Hey there!!!" });
  }
  //   if (interaction.isChatInputCommand()) {
  //     console.log("Hey World");
  //   }
});

async function main() {
  const commands = [
    {
      name: "ping",
      description: "Replies with Pong!",
    },
    {
      name: "translate",
      description: "Translate Hello World",
      options: [
        {
          name: "text",
          description: "text you want to translate",
          type: 3,
          required: false,
        },
        {
          name: "inputlanguage",
          description: "en, es etc.. (default: en)",
          type: 3,
          required: false,
        },
        {
          name: "translateto",
          description: "en, es etc.. (default: es)",
          type: 3,
          required: false,
        },
      ],
    },
    {
      name: "com2",
      description: "New Command with input",
      options: [
        {
          name: "text",
          description: "text you want to translate",
          type: 3,
          required: false,
        },
      ],
    },
  ];
  try {
    console.log("Started refreshing application (/) commands.");
    // Routes.applicationCommands();
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      {
        body: commands,
      }
    );
    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
}

main();
