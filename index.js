import { Client, GatewayIntentBits } from "discord.js";
import * as dotenv from "dotenv";
import { REST, Routes } from "discord.js";
import axios from "axios";
import {
  meaningCommand,
  translateCommand,
  weatherCommand,
} from "./commands/index.js";

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const rest = new REST({ version: "10" }).setToken(process.env.DISC_TOKEN);

client.on("ready", () => {
  console.log("Bot has Logged-in as", client.user.tag);
});
client.login(process.env.DISC_TOKEN);

client.on("messageCreate", (message) => {
  // console.log(JSON.stringify(message.author.bot));
  !message.author.bot
    ? console.log(
        "\n------------------------\n",
        message.content,
        "  ||  ",
        message.createdAt.toUTCString()
      )
    : "";
  // console.log(message.createdAt.toDateString());
  // console.log(message.guildId);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "translate") {
    // console.log(interaction.options.data.map((val) => val.value));
    const encodedParams = new URLSearchParams();
    encodedParams.set("from", interaction.options.getString("inputlanguage"));
    encodedParams.set("to", interaction.options.getString("outputlanguage"));
    encodedParams.set("text", interaction.options.getString("text"));

    const options = {
      method: "POST",
      url: "https://translo.p.rapidapi.com/api/v3/translate",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "X-RapidAPI-Key": "6f36b8407fmsh5482f70a37c0fdap1d16c3jsn3b8ecac16907",
        "X-RapidAPI-Host": "translo.p.rapidapi.com",
      },
      data: encodedParams,
    };

    try {
      await interaction.reply({
        content: "```Translating...```",
      });
      const response = await axios.request(options);
      // console.log(response.data.translated_text);
      const replied = await interaction.editReply({
        content: `\`\`\`${response.data.translated_text}\`\`\``,
      });

      await replied.react("✅");
    } catch (error) {
      console.error(error);
      await interaction.editReply({
        content: "```Translation failed!```",
      });
    }
  }
  // if (interaction.commandName === "order") {
  //   await interaction.reply({
  //     content: `You ordered ${interaction.options.get("food").value} ${
  //       interaction.options?.get("drink")?.value
  //         ? "& " + interaction.options?.get("drink")?.value
  //         : ""
  //     }`,
  //   });
  // }
  //   if (interaction.commandName === "ping") {
  //     await interaction.reply(
  //       "https://media4.giphy.com/media/26BoEeFJkz2eZUBcQ/giphy.gif?cid=ecf05e47d55n8ia84xuwc93rgbwwt6eaic8ahv1x15d6xvai&ep=v1_gifs_search&rid=giphy.gif&ct=g"
  //     );
  //   }
  if (interaction.commandName === "weather") {
    const options = {
      method: "GET",
      url: `https://wttr.in/${interaction.options.getString(
        "location"
      )}?format=j1`,
      // params: { city: interaction.options.getString("location") },
      headers: {
        "X-RapidAPI-Key": "6f36b8407fmsh5482f70a37c0fdap1d16c3jsn3b8ecac16907",
        "X-RapidAPI-Host": "weather-by-api-ninjas.p.rapidapi.com",
      },
    };

    try {
      await interaction.reply({
        content: `\`\`\`Looking for ${interaction.options.getString(
          "location"
        )}...\`\`\``,
      });
      const response = await axios.request(options);
      // console.log(JSON.stringify(response.data.nearest_area));
      const temp = Number(response.data.current_condition[0].temp_C);
      const replied = await interaction.editReply({
        content: `\`\`\`Location: ${interaction.options.getString(
          "location"
        )}\nNearby Location: ${
          response.data.nearest_area[0].areaName[0].value
        }\nTemperature: ${temp}\nFeels Like: ${
          response.data.current_condition[0].FeelsLikeC
        }\nHumidity: ${
          response.data.current_condition[0].humidity
        }\nWind Speed: ${
          response.data.current_condition[0].windspeedKmph
        }\nWeather Description: ${
          response.data.current_condition[0].weatherDesc[0].value
        }\nPrecipitation: ${
          response.data.current_condition[0].precipInches
        } Inches\nVisibility: ${
          response.data.current_condition[0].visibility
        }\`\`\``,
      });
      if (temp > 28 && temp < 32) {
        await replied.react("🌞");
      } else if (temp > 32) {
        await replied.react("🥵");
      } else if (temp < 28 && temp > 22) {
        await replied.react("🆒");
      } else if (temp < 22 && temp > 10) {
        await replied.react("❄️");
      } else if (temp < 10) {
        await replied.react("🥶");
      }
      // if(response.data.wind_speed)
    } catch (error) {
      if (error.response.status === 404) {
        const replied = await interaction.editReply({
          content: "```Location not found !```",
        });
        replied.react("🙃");
      } else {
        const replied = await interaction.editReply({
          content: "```Request failed !```",
        });
        replied.react("❌");
      }
      // console.error(error);
    }
  }
  if (interaction.commandName === "meaning") {
    const options = {
      method: "GET",
      url: `https://api.dictionaryapi.dev/api/v2/entries/en/${interaction.options.getString(
        "word"
      )}`,
    };

    try {
      await interaction.reply({
        content: `\`\`\`Searching the meaning of ${interaction.options.getString(
          "word"
        )}...\`\`\``,
      });
      const response = await axios.request(options);
      // console.log(response.data[0].meanings[0].definitions[0].definition);
      const replied = await interaction.editReply({
        content: `\`\`\`Meaning: ${
          response.data[0].meanings[0].definitions[0].definition
        }\`\`\`\n${
          response.data[0].meanings[0].definitions[0].example
            ? `\`\`\`Example use: ${response.data[0].meanings[0].definitions[0].example}\`\`\``
            : ""
        }`,
      });
      await replied.react("👍");
    } catch (error) {
      if (error.response.status === 404) {
        const replied = await interaction.editReply({
          content: `\`\`\`Difinition of ${interaction.options.getString(
            "word"
          )} not found\`\`\``,
        });
        replied.react("🙃");
      }
      console.error(error);
    }
  }
});

async function main() {
  const command = [translateCommand, weatherCommand, meaningCommand];

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
