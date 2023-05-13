import { Client, GatewayIntentBits } from "discord.js";
import * as dotenv from "dotenv";
import { REST, Routes } from "discord.js";
import axios from "axios";
import { SlashCommandBuilder } from "@discordjs/builders";

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

// client.on("messageCreate", (message) => {
//   console.log(message.content, "   ||  ", message.createdAt.toDateString());
//   console.log(message.createdAt.toDateString());
//   console.log(message.guildId);
// });

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "translate") {
    console.log(interaction.options.data.map((val) => val.value));
    const encodedParams = new URLSearchParams();
    encodedParams.set("q", interaction.options.getString("text"));
    encodedParams.set(
      "target",
      interaction.options.getString("outputlanguage")
    );
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
  if (interaction.commandName === "order") {
    await interaction.reply({
      content: `You ordered ${interaction.options.get("food").value} ${
        interaction.options?.get("drink")?.value
          ? "& " + interaction.options?.get("drink")?.value
          : ""
      }`,
    });
  }
  //   if (interaction.commandName === "ping") {
  //     await interaction.reply(
  //       "https://media4.giphy.com/media/26BoEeFJkz2eZUBcQ/giphy.gif?cid=ecf05e47d55n8ia84xuwc93rgbwwt6eaic8ahv1x15d6xvai&ep=v1_gifs_search&rid=giphy.gif&ct=g"
  //     );
  //   }
});

async function main() {
  const translateCommand = new SlashCommandBuilder()
    .setName("translate")
    .setDescription("Translate your texts from any language to any language")
    .addStringOption((option) =>
      option.setName("text").setDescription("Input your text").setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("inputlanguage")
        .setDescription("Your input text language?")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("outputlanguage")
        .setDescription("Your output text language?")
        .setRequired(true)
    );

  const orderCommand = new SlashCommandBuilder()
    .setName("order")
    .setDescription("Order your food!")
    .addStringOption((option) => {
      return option
        .setName("food")
        .setDescription("Select your Food")
        .setRequired(true)
        .setChoices(
          { name: "Cake", value: "Cake" },
          { name: "Burger", value: "Burger" },
          { name: "Pizza", value: "Pizza" }
        );
    })
    .addStringOption((option) => {
      return option
        .setName("drink")
        .setDescription("Select your drink")
        .setRequired(false)
        .setChoices(
          { name: "Water", value: "Water" },
          { name: "Coke", value: "Coke" },
          { name: "Mirinda", value: "Mirinda" }
        );
    });

  const command = [orderCommand.toJSON(), translateCommand.toJSON()];
  //   console.log(command);

  try {
    console.log("Started refreshing application (/) commands.");
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      {
        body: command, // body: [orderCommand.toJSON()],
      }
    );
    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
}

main();
